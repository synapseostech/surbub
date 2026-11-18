export type BusinessCategory = 
  | 'restaurant' 
  | 'pharmacy' 
  | 'laundry' 
  | 'rides' 
  | 'vehicle_hire' 
  | 'groceries' 
  | 'services';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  neighborhood: string;
  address: string;
}

export interface OperatingHours {
  open: string;
  close: string;
  days: string[];
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  tagline: string;
  description: string;
  logo: string;
  bannerImage: string;
  rating: number;
  reviewCount: number;
  location: LocationCoordinates;
  phone: string;
  whatsapp?: string;
  email?: string;
  hours: OperatingHours;
  isVerified: boolean;
  isOpen: boolean;
  deliveryTimeEstimate?: string;
  minOrder?: number;
  featured?: boolean;
}
