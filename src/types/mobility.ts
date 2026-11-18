export type RideType = 
  | 'boda'             // Quick motorbike
  | 'delivery_boda'    // Parcel / package delivery
  | 'matatu_shared'    // Shared commuter taxi
  | 'special_hire';    // Private town car

export interface RideOption {
  type: RideType;
  title: string;
  description: string;
  baseFareUGX: number;
  ratePerKmUGX: number;
  capacity: string;
  etaMinutes: number;
  iconName: string;
}

export interface RideEstimate {
  rideType: RideType;
  pickupLocation: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  baseFareUGX: number;
  distanceFareUGX: number;
  totalFareUGX: number;
  isSimulatedEstimate: boolean;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  plateNumber: string;
  vehicleModel: string;
  rating: number;
  totalTrips: number;
  photoUrl: string;
}

export type RideStatus = 
  | 'requesting' 
  | 'driver_assigned' 
  | 'driver_arriving' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface RideRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  rideType: RideType;
  pickup: string;
  destination: string;
  distanceKm: number;
  fareUGX: number;
  status: RideStatus;
  assignedDriver?: DriverInfo;
  createdAt: string;
  completedAt?: string;
}

// Vehicle Hire
export type VehicleCategory = 
  | 'saloon_car' 
  | 'suv_4x4' 
  | 'minivan_van' 
  | 'pickup_truck';

export interface VehicleHireListing {
  id: string;
  title: string;
  category: VehicleCategory;
  model: string;
  year: number;
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel';
  dailyRateUGX: number;
  withDriverOnly: boolean;
  features: string[];
  images: string[];
  availability: 'Available Now' | 'Booked Today' | 'Advance Booking Only';
  hostName: string;
  hostPhone: string;
  hostWhatsApp: string;
  location: string;
}

export interface VehicleInquiry {
  id: string;
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  durationDays: number;
  estimatedCostUGX: number;
  destinationRegion: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
