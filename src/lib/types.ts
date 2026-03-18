export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
}

export interface Service {
  title: string;
  image: string;
  description: string;
}

export interface GalleryItem {
  url: string;
}

export interface PlaceResult {
  name: string;
  phone?: string;
  address?: string;
  website?: string;
  googleMapsUrl?: string;
  placeId: string;
  photoReference?: string;
}
