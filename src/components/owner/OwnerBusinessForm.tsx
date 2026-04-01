"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Image as ImageIcon, Upload, Plus, Trash2 } from "lucide-react";
import imageCompression from "browser-image-compression";

export default function OwnerBusinessForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => {
    const parseJson = (val: any) => {
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return null; }
      }
      return val;
    };

    const socialLinks = parseJson(initialData.socialLinks);
    const services = parseJson(initialData.services);
    const gallery = parseJson(initialData.gallery);

    return {
      ...initialData,
      socialLinks: Array.isArray(socialLinks)
        ? socialLinks
        : socialLinks && typeof socialLinks === "object"
          ? Object.entries(socialLinks)
              .filter(([_, val]) => val)
              .map(([platform, url]) => ({ platform, url: url as string }))
          : [],
      services: Array.isArray(services) ? services : [],
      gallery: Array.isArray(gallery) ? gallery : [],
    };
  });

  const handleFileUpload = async (file: File, type: "logo" | "coverPhoto" | "gallery") => {
    setUploading(type);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const body = new FormData();
      body.append("file", compressedFile);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        if (type === "gallery") {
          setFormData((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), data.url] }));
        } else {
          setFormData((prev: any) => ({ ...prev, [type]: data.url }));
        }
        toast.success("Uploaded successfully!");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(null);
  };

  const handleServiceImageUpload = async (file: File, index: number) => {
    const uploadKey = `service-${index}`;
    setUploading(uploadKey);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const body = new FormData();
      body.append("file", compressedFile);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], image: data.url };
        setFormData({ ...formData, services: newServices });
        toast.success("Image uploaded!");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...formData,
      socialLinks: JSON.stringify(formData.socialLinks || []),
      services: JSON.stringify(formData.services || []),
      gallery: JSON.stringify(formData.gallery || []),
    };

    // Remove fields owners cannot change (just in case)
    delete submitData.id;
    delete submitData.slug;
    delete submitData.isActive;
    delete submitData.ownerEmail;
    delete submitData.ownerPassword;
    delete submitData.createdAt;
    delete submitData.updatedAt;

    try {
      const res = await fetch("/api/owner/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Card updated successfully!");
      router.push("/owner/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
    color: "#0f172a",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };

  const sectionHeaderStyle = {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
    paddingBottom: "10px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: "16px",
    gridColumn: "1 / -1",
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Basic Info */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={sectionHeaderStyle}>Basic Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Business Name *</label>
              <input required style={inputStyle} value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Owner Name</label>
              <input style={inputStyle} value={formData.ownerName || ""} onChange={e => setFormData({ ...formData, ownerName: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Designation</label>
              <input style={inputStyle} value={formData.designation || ""} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={inputStyle} value={formData.category || ""} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Year Established</label>
              <input style={inputStyle} value={formData.yearEstd || ""} onChange={e => setFormData({ ...formData, yearEstd: e.target.value })} placeholder="e.g. 2010" />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={sectionHeaderStyle}>Contact Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" style={inputStyle} value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp</label>
              <input type="tel" style={inputStyle} value={formData.whatsapp || ""} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" style={inputStyle} value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input type="url" style={inputStyle} value={formData.website || ""} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Address</label>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={formData.address || ""} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Google Maps URL</label>
              <input type="url" style={inputStyle} value={formData.googleMapsUrl || ""} onChange={e => setFormData({ ...formData, googleMapsUrl: e.target.value })} placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </section>

        {/* Theme */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={sectionHeaderStyle}>Theme & Appearance</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Theme Template</label>
              <select style={{ ...inputStyle, appearance: "auto" }} value={formData.theme} onChange={e => setFormData({ ...formData, theme: e.target.value })}>
                <option value="theme1">Clean Light (Theme 1)</option>
                <option value="theme2">Dark Glass (Theme 2)</option>
                <option value="theme3">Gradient Modern (Theme 3)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Brand Color</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="color" style={{ padding: "2px", height: "42px", width: "48px", borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer" }} value={formData.themeColor} onChange={e => setFormData({ ...formData, themeColor: e.target.value })} />
                <input type="text" style={{ ...inputStyle, flex: 1 }} value={formData.themeColor} onChange={e => setFormData({ ...formData, themeColor: e.target.value })} />
              </div>
            </div>
          </div>
        </section>

        {/* Media */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={sectionHeaderStyle}>Branding & Media</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Logo */}
            <div>
              <label style={labelStyle}>Logo</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "12px", border: "2px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#f8fafc", flexShrink: 0 }}>
                  {formData.logo ? <img src={formData.logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <ImageIcon style={{ color: "#cbd5e1", width: "24px", height: "24px" }} />}
                </div>
                <label style={{ cursor: "pointer", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "6px" }}>
                  {uploading === "logo" ? <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} /> : <Upload style={{ width: "14px", height: "14px" }} />}
                  Upload
                  <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo")} />
                </label>
              </div>
            </div>

            {/* Cover Photo */}
            <div>
              <label style={labelStyle}>Cover Photo</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ width: "100%", height: "72px", borderRadius: "12px", border: "2px dashed #e2e8f0", overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {formData.coverPhoto ? <img src={formData.coverPhoto} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon style={{ color: "#cbd5e1", width: "24px", height: "24px" }} />}
                </div>
                <label style={{ cursor: "pointer", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  {uploading === "coverPhoto" ? <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} /> : <Upload style={{ width: "14px", height: "14px" }} />}
                  Upload
                  <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "coverPhoto")} />
                </label>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Gallery Images</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" }}>
              {formData.gallery?.map((img: string, i: number) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, gallery: prev.gallery.filter((_: any, idx: number) => idx !== i) }))}
                    style={{ position: "absolute", top: "3px", right: "3px", background: "#ef4444", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 style={{ color: "white", width: "10px", height: "10px" }} />
                  </button>
                </div>
              ))}
              {(!formData.gallery || formData.gallery.length < 30) && (
                <label style={{ cursor: "pointer", aspectRatio: "1", borderRadius: "10px", border: "2px dashed #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "11px", fontWeight: 600 }}>
                  <Plus style={{ width: "20px", height: "20px", marginBottom: "4px" }} />
                  Add
                  <input type="file" style={{ display: "none" }} multiple accept="image/*" onChange={e => { 
                    if (e.target.files) {
                      const remaining = 30 - (formData.gallery?.length || 0);
                      const files = Array.from(e.target.files);
                      if (files.length > remaining) {
                        toast.error(`You can only add ${remaining} more image(s). Maximum 30 allowed.`);
                      }
                      files.slice(0, remaining).forEach(f => handleFileUpload(f, "gallery"));
                    }
                  }} />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Social Media Links</h2>
            <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, socialLinks: [...(prev.socialLinks || []), { platform: "facebook", url: "" }] }))}
              style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#0ea5e9", background: "none", border: "1px solid #bae6fd", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}>
              <Plus style={{ width: "14px", height: "14px" }} /> Add Link
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {formData.socialLinks?.map((link: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select style={{ ...inputStyle, width: "160px", flexShrink: 0, appearance: "auto" }} value={link.platform} onChange={e => { const n = [...formData.socialLinks]; n[i] = { ...n[i], platform: e.target.value }; setFormData({ ...formData, socialLinks: n }); }}>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="website">Website</option>
                  <option value="googlereview">Google Review</option>
                  <option value="other">Other</option>
                </select>
                <input type="url" placeholder="https://..." style={{ ...inputStyle, flex: 1 }} value={link.url} onChange={e => { const n = [...formData.socialLinks]; n[i] = { ...n[i], url: e.target.value }; setFormData({ ...formData, socialLinks: n }); }} />
                <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, socialLinks: prev.socialLinks.filter((_: any, idx: number) => idx !== i) }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px", display: "flex" }}>
                  <Trash2 style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            ))}
            {(!formData.socialLinks || formData.socialLinks.length === 0) && (
              <p style={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>No social links yet. Click "Add Link" to add one.</p>
            )}
          </div>
        </section>

        {/* Services */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Services & Products</h2>
            {(!formData.services || formData.services.length < 10) && (
              <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, services: [...(prev.services || []), { title: "", description: "", image: "" }] }))}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#0ea5e9", background: "none", border: "1px solid #bae6fd", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}>
                <Plus style={{ width: "14px", height: "14px" }} /> Add Service
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {formData.services?.map((service: any, i: number) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", border: "1px solid #e2e8f0", position: "relative" }}>
                <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, services: prev.services.filter((_: any, idx: number) => idx !== i) }))}
                  style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <Trash2 style={{ width: "16px", height: "16px" }} />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px" }}>
                  <div>
                    <div style={{ aspectRatio: "1", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden", background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                      {service.image ? <img src={service.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <ImageIcon style={{ color: "#cbd5e1", width: "20px", height: "20px" }} />}
                    </div>
                    <label style={{ cursor: "pointer", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "5px", fontSize: "11px", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      {uploading === `service-${i}` ? <Loader2 style={{ width: "12px", height: "12px", animation: "spin 1s linear infinite" }} /> : <Upload style={{ width: "12px", height: "12px" }} />}
                      Image
                      <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => e.target.files?.[0] && handleServiceImageUpload(e.target.files[0], i)} />
                    </label>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input type="text" placeholder="Service title..." style={inputStyle} value={service.title} onChange={e => { const n = [...formData.services]; n[i] = { ...n[i], title: e.target.value }; setFormData({ ...formData, services: n }); }} />
                    <textarea rows={2} placeholder="Description..." style={{ ...inputStyle, resize: "vertical" }} value={service.description} onChange={e => { const n = [...formData.services]; n[i] = { ...n[i], description: e.target.value }; setFormData({ ...formData, services: n }); }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={sectionHeaderStyle}>About & Description</h2>
          <div>
            <label style={labelStyle}>Company Description</label>
            <textarea rows={6} style={{ ...inputStyle, resize: "vertical" }} value={formData.about || ""} onChange={e => setFormData({ ...formData, about: e.target.value })} placeholder="Tell your customers about your business..." />
          </div>
        </section>

        {/* Save Button */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => router.back()}
            style={{ padding: "12px 24px", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#374151", fontWeight: 500, cursor: "pointer", fontSize: "14px" }}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            style={{ padding: "12px 28px", background: loading ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg, #0ea5e9, #8b5cf6)", border: "none", borderRadius: "10px", color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(14,165,233,0.25)" }}>
            {loading && <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />}
            Save Changes
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
