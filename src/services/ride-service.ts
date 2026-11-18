import { 
  RideOption, 
  RideEstimate, 
  RideRequest, 
  RideType, 
  DriverInfo, 
  VehicleHireListing, 
  VehicleInquiry 
} from '@/types/mobility';
import { 
  FARE_CONFIG, 
  MOCK_RIDE_OPTIONS, 
  MOCK_DRIVERS, 
  INITIAL_MOCK_RIDES, 
  ESTIMATED_DISTANCES_KM, 
  POPULAR_LOCATIONS 
} from '@/data/mock/mobility';
import { getStoredItem, setStoredItem } from './storage';

const RIDES_STORAGE_KEY = 'suburbplus_mock_rides';

export interface IRideService {
  getRideOptions(): RideOption[];
  getPopularLocations(): string[];
  calculateEstimate(pickup: string, destination: string, type: RideType): RideEstimate;
  requestRide(request: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    rideType: RideType;
    pickup: string;
    destination: string;
  }): Promise<RideRequest>;
  getRideById(rideId: string): Promise<RideRequest | null>;
  getCustomerRides(customerId: string): Promise<RideRequest[]>;
  getAllRides(): Promise<RideRequest[]>;
}

class MockRideService implements IRideService {
  private getRides(): RideRequest[] {
    return getStoredItem<RideRequest[]>(RIDES_STORAGE_KEY, INITIAL_MOCK_RIDES);
  }

  private saveRides(rides: RideRequest[]): void {
    setStoredItem(RIDES_STORAGE_KEY, rides);
  }

  getRideOptions(): RideOption[] {
    return MOCK_RIDE_OPTIONS;
  }

  getPopularLocations(): string[] {
    return POPULAR_LOCATIONS;
  }

  calculateEstimate(pickup: string, destination: string, type: RideType): RideEstimate {
    // Look up road distance estimate or calculate realistic route distance
    const key1 = `${pickup}_${destination}`;
    const key2 = `${destination}_${pickup}`;
    
    let distanceKm = ESTIMATED_DISTANCES_KM[key1] || ESTIMATED_DISTANCES_KM[key2];
    if (!distanceKm) {
      if (pickup === destination) {
        distanceKm = 1.0;
      } else {
        // Deterministic pseudo-distance based on string lengths between 1.5km and 7.5km
        const hash = Math.abs((pickup + destination).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
        distanceKm = parseFloat((1.5 + (hash % 60) / 10).toFixed(1));
      }
    }

    const option = MOCK_RIDE_OPTIONS.find(o => o.type === type) || MOCK_RIDE_OPTIONS[0];
    const baseFare = option.baseFareUGX;
    const distanceFare = Math.round(distanceKm * option.ratePerKmUGX);
    const totalFare = baseFare + distanceFare;
    const durationMinutes = Math.max(4, Math.round(distanceKm * 3.5));

    return {
      rideType: type,
      pickupLocation: pickup,
      destination: destination,
      distanceKm,
      durationMinutes,
      baseFareUGX: baseFare,
      distanceFareUGX: distanceFare,
      totalFareUGX: totalFare,
      isSimulatedEstimate: true,
    };
  }

  async requestRide(params: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    rideType: RideType;
    pickup: string;
    destination: string;
  }): Promise<RideRequest> {
    const estimate = this.calculateEstimate(params.pickup, params.destination, params.rideType);
    const assignedDriver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];

    const newRide: RideRequest = {
      id: `ride_${Date.now()}`,
      customerId: params.customerId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      rideType: params.rideType,
      pickup: params.pickup,
      destination: params.destination,
      distanceKm: estimate.distanceKm,
      fareUGX: estimate.totalFareUGX,
      status: 'driver_assigned',
      assignedDriver: assignedDriver,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const rides = this.getRides();
    rides.unshift(newRide);
    this.saveRides(rides);

    return newRide;
  }

  async getRideById(rideId: string): Promise<RideRequest | null> {
    const rides = this.getRides();
    return rides.find(r => r.id === rideId) || null;
  }

  async getCustomerRides(customerId: string): Promise<RideRequest[]> {
    const rides = this.getRides();
    return rides.filter(r => r.customerId === customerId);
  }

  async getAllRides(): Promise<RideRequest[]> {
    return this.getRides();
  }
}

export const rideService: IRideService = new MockRideService();
