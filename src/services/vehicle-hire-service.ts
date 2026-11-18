import { VehicleHireListing, VehicleInquiry, VehicleCategory } from '@/types/mobility';
import { MOCK_VEHICLE_HIRE_LISTINGS } from '@/data/mock/mobility';
import { getStoredItem, setStoredItem } from './storage';

const INQUIRIES_STORAGE_KEY = 'suburbplus_vehicle_inquiries';

export interface IVehicleHireService {
  getAllVehicles(category?: VehicleCategory): Promise<VehicleHireListing[]>;
  getVehicleById(id: string): Promise<VehicleHireListing | null>;
  createInquiry(inquiry: Omit<VehicleInquiry, 'id' | 'status' | 'createdAt'>): Promise<VehicleInquiry>;
  generateWhatsAppLink(vehicle: VehicleHireListing, customerName?: string, days?: number): string;
}

class MockVehicleHireService implements IVehicleHireService {
  async getAllVehicles(category?: VehicleCategory): Promise<VehicleHireListing[]> {
    if (!category || category === ('all' as any)) return MOCK_VEHICLE_HIRE_LISTINGS;
    return MOCK_VEHICLE_HIRE_LISTINGS.filter(v => v.category === category);
  }

  async getVehicleById(id: string): Promise<VehicleHireListing | null> {
    return MOCK_VEHICLE_HIRE_LISTINGS.find(v => v.id === id) || null;
  }

  async createInquiry(inquiry: Omit<VehicleInquiry, 'id' | 'status' | 'createdAt'>): Promise<VehicleInquiry> {
    const inquiries = getStoredItem<VehicleInquiry[]>(INQUIRIES_STORAGE_KEY, []);
    const newInquiry: VehicleInquiry = {
      ...inquiry,
      id: `inq_veh_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    setStoredItem(INQUIRIES_STORAGE_KEY, inquiries);
    return newInquiry;
  }

  generateWhatsAppLink(vehicle: VehicleHireListing, customerName?: string, days?: number): string {
    const phone = vehicle.hostWhatsApp.replace('+', '').replace(/\s+/g, '');
    const duration = days ? `${days} day(s)` : 'a few days';
    const nameStr = customerName ? `My name is ${customerName}. ` : '';
    const text = encodeURIComponent(
      `Hello ${vehicle.hostName}, I am inquiring via SUBURB+ regarding renting the ${vehicle.title} (Daily Rate: UGX ${vehicle.dailyRateUGX.toLocaleString()}) for ${duration}. ${nameStr}Is it available for demonstration booking?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  }
}

export const vehicleHireService: IVehicleHireService = new MockVehicleHireService();
