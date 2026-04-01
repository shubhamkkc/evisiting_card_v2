"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Search, Loader2, Image as ImageIcon, Upload, Plus, Trash2, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, MapPin } from "lucide-react";
import imageCompression from "browser-image-compression";

export default function BusinessForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placesResults, setPlacesResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [uploading, setUploading] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState(() => {
    // Process initial data if it exists
    if (initialData) {
      const parseJson = (val: any) => {
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch (e) { return null; }
        }
        return val;
      };

      const socialLinks = parseJson(initialData.socialLinks);
      const services = parseJson(initialData.services);
      const gallery = parseJson(initialData.gallery);

      return {
        ...initialData,
        slug: initialData.slug || "",
        socialLinks: Array.isArray(socialLinks) 
          ? socialLinks 
          : (socialLinks && typeof socialLinks === 'object'
              ? Object.entries(socialLinks)
                  .filter(([_, val]) => val)
                  .map(([platform, url]) => ({ platform, url: url as string }))
              : []
            ),
        services: Array.isArray(services) ? services : [],
        gallery: Array.isArray(gallery) ? gallery : [],
      };
    }

    // Default state for new business
    return {
      slug: "", businessName: "", ownerName: "", designation: "",
      phone: "", whatsapp: "", email: "", website: "", address: "",
      googleMapsUrl: "", logo: "", coverPhoto: "", about: "", category: "",
      yearEstd: "", theme: "theme1", themeColor: "#0ea5e9", isActive: true,
      ownerEmail: "", ownerPassword: "",
      socialLinks: [
        { platform: "facebook", url: "" },
        { platform: "instagram", url: "" }
      ],
      services: [],
      gallery: [],
    };
  });

  const handleFileUpload = async (file: File, type: 'logo' | 'coverPhoto' | 'gallery') => {
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
        if (type === 'gallery') {
          setFormData((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), data.url] }));
        } else {
          setFormData((prev: any) => ({ ...prev, [type]: data.url }));
        }
        toast.success("Uploaded successfully!");
      }
    } catch (error) {
      toast.error("Upload failed");
    }
    setUploading(null);
  };

  const addService = () => {
    if (formData.services?.length >= 10) {
      toast.error("You can only add up to 10 products & services.");
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      services: [...(prev.services || []), { title: "", description: "", image: "" }]
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
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
        updateService(index, 'image', data.url);
        toast.success("Service image uploaded!");
      }
    } catch (error) {
      toast.error("Upload failed");
    }
    setUploading(null);
  };

  const removeService = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      services: prev.services.filter((_: any, i: number) => i !== index)
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      gallery: prev.gallery.filter((_: any, i: number) => i !== index)
    }));
  };

  const addSocialLink = () => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { platform: "facebook", url: "" }]
    }));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_: any, i: number) => i !== index)
    }));
  };

  const searchPlaces = async (query: string) => {
    setSearchQuery(query);
    if (!query) return setPlacesResults([]);
    
    setSearching(true);
    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setPlacesResults(data);
      }
    } catch (error) {
      console.error(error);
    }
    setSearching(false);
  };

  const selectPlace = async (placeId: string) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/places?placeId=${placeId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData((prev: any) => ({
          ...prev,
          businessName: prev.businessName || data.name,
          address: prev.address || data.address,
          phone: prev.phone ? prev.phone : (data.phone || ""),
          website: prev.website || data.website || "",
          googleMapsUrl: prev.googleMapsUrl || data.googleMapsUrl || "",
        }));
        toast.success("Details auto-filled from Google Maps!");
        setPlacesResults([]);
        setSearchQuery("");
      }
    } catch (error) {
      toast.error("Failed to fetch place details");
    }
    setSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Destructure properties we don't want to send directly (like ID or Prisma timestamps)
    const { id, createdAt, updatedAt, ...updatableData } = formData;

    // Format complex objects to strings for Prisma
    const submitData: any = {
      ...updatableData,
      slug: (formData.slug || "").toLowerCase().replace(/\s+/g, '-'),
      socialLinks: JSON.stringify(formData.socialLinks || []),
      services: JSON.stringify(formData.services || []),
      gallery: JSON.stringify(formData.gallery || []),
    };

    // Only include ownerPassword if it was entered (admin is setting/changing it)
    if (!submitData.ownerPassword) {
      delete submitData.ownerPassword;
    }
    // Remove empty ownerEmail
    if (!submitData.ownerEmail) {
      submitData.ownerEmail = null;
    }

    try {
      const res = await fetch(isEditing ? `/api/businesses/${id}` : "/api/businesses", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error(await res.text());
      
      toast.success(isEditing ? "Updated successfully!" : "Created successfully!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <>
      <Toaster />
      
      {!isEditing && (
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8 relative z-50">
          <div className="flex gap-3 mb-4 items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Google Maps Auto-fill</h3>
              <p className="text-sm text-gray-500">Search for the business to fast-track creation</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Start typing to search on Google Maps..."
              value={searchQuery}
              onChange={(e) => searchPlaces(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
            />
            {searching && <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 animate-spin" />}
            
            {placesResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                {placesResults.map((place: any) => (
                  <button
                    key={place.place_id}
                    type="button"
                    onClick={() => selectPlace(place.place_id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="font-semibold text-gray-900">{place.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[90%] truncate">{place.formatted_address}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2">
            <h2 className="text-lg font-bold text-gray-900">Basic Info</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Link Slug *</label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                domain.com/
              </span>
              <input type="text" required className="flex-1 block w-full outline-none min-w-0 rounded-none rounded-r-lg sm:text-sm border-gray-300 px-3 py-2 border focus:ring-2 focus:ring-blue-500" placeholder="brand-name" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
          </div>
          
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label><input type="text" required className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label><input type="text" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Designation</label><input type="text" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>

          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-4">
            <h2 className="text-lg font-bold text-gray-900">Contact Details</h2>
          </div>
          
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="tel" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input type="tel" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input type="url" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} /></div>
          
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea rows={3} className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label><input type="url" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.googleMapsUrl} onChange={e => setFormData({...formData, googleMapsUrl: e.target.value})} /></div>
          
          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-4">
            <h2 className="text-lg font-bold text-gray-900">Theme Details</h2>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Theme Template</label>
             <select className="block w-full rounded-lg border-gray-300 px-4 py-2 border bg-white focus:ring-2 focus:ring-blue-500" value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})}>
               <option value="theme1">Clean Light (Theme 1)</option>
               <option value="theme2">Dark Glass (Theme 2)</option>
               <option value="theme3">Gradient Modern (Theme 3)</option>
             </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Brand Color (Hex)</label>
             <div className="flex gap-2">
                <input type="color" className="p-1 h-10 w-12 rounded border border-gray-300 cursor-pointer" value={formData.themeColor} onChange={e => setFormData({...formData, themeColor: e.target.value})} />
                <input type="text" className="block flex-1 rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.themeColor} onChange={e => setFormData({...formData, themeColor: e.target.value})} />
             </div>
          </div>

          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-4">
            <h2 className="text-lg font-bold text-gray-900">Branding & Media</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
                {uploading === 'logo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Logo
                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
            <div className="flex flex-col gap-3">
              <div className="w-full h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {formData.coverPhoto ? (
                  <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                {uploading === 'coverPhoto' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Cover Photo
                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'coverPhoto')} />
              </label>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {formData.gallery?.map((img: string, i: number) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {(!formData.gallery || formData.gallery.length < 30) && (
                <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                   <Plus className="w-6 h-6 mb-1" />
                   <span className="text-[10px] uppercase font-bold tracking-wider">Add</span>
                   <input type="file" className="hidden" multiple accept="image/*" onChange={e => {
                     if (e.target.files) {
                       const remaining = 30 - (formData.gallery?.length || 0);
                       const files = Array.from(e.target.files);
                       if (files.length > remaining) {
                         toast.error(`You can only add ${remaining} more image(s). Maximum 30 allowed.`);
                       }
                       files.slice(0, remaining).forEach(file => handleFileUpload(file, 'gallery'));
                     }
                   }} />
                </label>
              )}
            </div>
          </div>

          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Social Media Links</h2>
            <button type="button" onClick={addSocialLink} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            {formData.socialLinks?.map((link: any, i: number) => (
              <div key={i} className="flex gap-3 items-start group">
                <select 
                  className="w-1/3 rounded-lg border-gray-300 px-3 py-2 border outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={link.platform}
                  onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp Channel</option>
                  <option value="telegram">Telegram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="website">Personal Website</option>
                  <option value="googlereview">Google Review Link</option>
                  <option value="other">Other Link</option>
                </select>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  className="flex-1 rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" 
                  value={link.url} 
                  onChange={e => updateSocialLink(i, 'url', e.target.value)} 
                />
                <button type="button" onClick={() => removeSocialLink(i)} className="p-2 text-gray-300 hover:text-red-500 mt-0.5">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!formData.socialLinks || formData.socialLinks.length === 0) && (
              <p className="text-sm text-gray-400 italic">No social links added yet</p>
            )}
          </div>

          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Services & Products</h2>
            {(!formData.services || formData.services.length < 10) && (
              <button type="button" onClick={addService} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Service
              </button>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            {formData.services?.map((service: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                <button type="button" onClick={() => removeService(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-[120px_1fr] gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="w-full aspect-square rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 py-1.5 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-1 uppercase tracking-tight">
                      {uploading === `service-${i}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      Image
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleServiceImageUpload(e.target.files[0], i)} />
                    </label>
                  </div>
                  <div className="grid gap-3">
                    <input type="text" placeholder="Service Title (e.g. Free Home Delivery)" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={service.title} onChange={e => updateService(i, 'title', e.target.value)} />
                    <textarea rows={2} placeholder="Description..." className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={service.description} onChange={e => updateService(i, 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-4">
            <h2 className="text-lg font-bold text-gray-900">About & Description</h2>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
            <textarea rows={5} className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="Tell your customers about your business..." />
          </div>

          <div><label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label><input type="text" className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-blue-500" value={formData.yearEstd} onChange={e => setFormData({...formData, yearEstd: e.target.value})} placeholder="e.g. 1995" /></div>

          {/* Owner Access Section */}
          <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Owner Access</h2>
                <p className="text-sm text-gray-400">Set login credentials so the business owner can edit their own card</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Login Email</label>
            <input
              type="email"
              className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="owner@business.com"
              value={formData.ownerEmail || ""}
              onChange={e => setFormData({...formData, ownerEmail: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditing ? "New Password (leave blank to keep current)" : "Owner Password"}
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border-gray-300 px-4 py-2 border outline-none focus:ring-2 focus:ring-violet-500 font-mono"
              placeholder={isEditing ? "Enter new password to change..." : "Set a secure password"}
              value={formData.ownerPassword || ""}
              onChange={e => setFormData({...formData, ownerPassword: e.target.value})}
            />
          </div>

          {(formData.ownerEmail) && (
            <div className="md:col-span-2 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-violet-700">Owner Login Link</p>
                <p className="text-xs text-violet-500 mt-0.5">Share this URL with the business owner</p>
              </div>
              <a
                href={`${typeof window !== 'undefined' ? window.location.origin : ''}/owner/login`}
                target="_blank"
                className="text-sm font-mono text-violet-600 hover:underline bg-white px-3 py-1.5 rounded-lg border border-violet-200"
              >
                /owner/login
              </a>
            </div>
          )}

        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white shadow-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEditing ? "Save Changes" : "Create Card"}
          </button>
        </div>
      </form>
    </>
  );
}
