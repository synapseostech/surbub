import { Business } from './business';

export type FoodCategory = 
  | 'traditional' 
  | 'fast_food' 
  | 'grill_bbq' 
  | 'breakfast' 
  | 'beverages' 
  | 'snacks_rolex' 
  | 'platters';

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // In UGX
  category: FoodCategory;
  image: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  isPopular?: boolean;
  dietaryTags?: string[];
  options?: {
    name: string;
    choices: { name: string; extraPrice: number }[];
  }[];
}

export interface Restaurant extends Business {
  cuisine: string[];
  priceRange: 'UGX' | 'UGX UGX' | 'UGX UGX UGX';
  acceptsPickUp: boolean;
  acceptsDelivery: boolean;
  averageDeliveryFee: number;
  menu?: MenuItem[];
}
