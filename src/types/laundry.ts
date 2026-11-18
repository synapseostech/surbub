import { Business } from './business';

export type LaundryCategory = 
  | 'wash_fold' 
  | 'ironing_pressing' 
  | 'dry_cleaning' 
  | 'bedding_curtains' 
  | 'express_same_day';

export interface LaundryServiceItem {
  id: string;
  providerId: string;
  name: string;
  description: string;
  category: LaundryCategory;
  pricePerUnitUGX: number;
  unit: 'piece' | 'kg' | 'pair' | 'set';
  turnaroundTime: string;
  image?: string;
}

export interface LaundryProvider extends Business {
  services: LaundryServiceItem[];
  turnaroundHoursStandard: number;
  expressAvailable: boolean;
  offersFreePickupAbove?: number;
  pickupFeeUGX: number;
}

export interface LaundryBookingRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  items: {
    serviceItemId: string;
    name: string;
    quantity: number;
    estimatedPriceUGX: number;
  }[];
  pickupAddress: string;
  pickupDate: string;
  pickupTimeSlot: string;
  specialInstructions?: string;
  estimatedTotalUGX: number;
  status: 'pending' | 'pickup_scheduled' | 'washing' | 'ready_for_delivery' | 'completed' | 'cancelled';
  createdAt: string;
}
