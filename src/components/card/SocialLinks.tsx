import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter, 
  Globe, 
  MessageCircle, 
  Send, 
  Music, 
  Ghost,
  Link
} from "lucide-react";

export default function SocialLinks({ socialLinks, theme }: { socialLinks: any; theme: any }) {
  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "facebook": return <Facebook className="w-5 h-5" />;
      case "instagram": return <Instagram className="w-5 h-5" />;
      case "linkedin": return <Linkedin className="w-5 h-5" />;
      case "youtube": return <Youtube className="w-5 h-5" />;
      case "twitter": return <Twitter className="w-5 h-5" />;
      case "whatsapp": return <MessageCircle className="w-5 h-5" />;
      case "telegram": return <Send className="w-5 h-5" />;
      case "tiktok": return <Music className="w-5 h-5" />;
      case "snapchat": return <Ghost className="w-5 h-5" />;
      case "website": return <Globe className="w-5 h-5" />;
      default: return <Link className="w-5 h-5" />;
    }
  };

  // Normalize links into an array of { platform, url }
  let activeLinks: { platform: string, url: string }[] = [];
  
  if (Array.isArray(socialLinks)) {
    activeLinks = socialLinks.filter(l => l.url);
  } else if (typeof socialLinks === 'object' && socialLinks !== null) {
    activeLinks = Object.entries(socialLinks)
      .filter(([_, val]) => val)
      .map(([platform, url]) => ({ platform, url: url as string }));
  }

  if (activeLinks.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl ${theme.cardBg} flex flex-wrap justify-center gap-4`}>
      {activeLinks.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={`p-3 rounded-full transition-all duration-300 ${theme.iconBg} hover:opacity-80 hover:scale-110 active:scale-95 shadow-sm border border-black/5`}
          aria-label={link.platform}
        >
          {getIcon(link.platform)}
        </a>
      ))}
    </div>
  );
}
