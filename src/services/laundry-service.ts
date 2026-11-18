import { LaundryProvider, LaundryServiceItem, LaundryBookingRequest, LaundryCategory } from '@/types/laundry';
import { MOCK_LAUNDRY_PROVIDERS, MOCK_LAUNDRY_SERVICES, INITIAL_MOCK_BOOKINGS } from '@/data/mock/laundry';
import { getStoredItem, setStoredItem } from './storage';

const STORAGE_KEY = 'suburbplus_laundry_bookings';

export interface ILaundryService {
  getAllProviders(): Promise<LaundryProvider[]>;
  getProviderById(id: string): Promise<LaundryProvider | null>;
  getServicesByProvider(providerId: string, category?: LaundryCategory): Promise<LaundryServiceItem[]>;
  createBooking(request: Omit<LaundryBookingRequest, 'id' | 'createdAt' | 'status'>): Promise<LaundryBookingRequest>;
  getBookingsByCustomer(customerId: string): Promise<LaundryBookingRequest[]>;
  getAllBookings(): Promise<LaundryBookingRequest[]>;
  updateBookingStatus(bookingId: string, status: LaundryBookingRequest['status']): Promise<LaundryBookingRequest | null>;
}

class MockLaundryService implements ILaundryService {
  private getBookings(): LaundryBookingRequest[] {
    return getStoredItem<LaundryBookingRequest[]>(STORAGE_KEY, INITIAL_MOCK_BOOKINGS);
  }

  private saveBookings(bookings: LaundryBookingRequest[]): void {
    setStoredItem(STORAGE_KEY, bookings);
  }

  async getAllProviders(): Promise<LaundryProvider[]> {
    return MOCK_LAUNDRY_PROVIDERS;
  }

  async getProviderById(id: string): Promise<LaundryProvider | null> {
    const provider = MOCK_LAUNDRY_PROVIDERS.find(p => p.id === id);
    if (!provider) return null;
    return {
      ...provider,
      services: MOCK_LAUNDRY_SERVICES[id] || [],
    };
  }

  async getServicesByProvider(providerId: string, category?: LaundryCategory): Promise<LaundryServiceItem[]> {
    const services = MOCK_LAUNDRY_SERVICES[providerId] || [];
    if (!category || category === ('all' as any)) return services;
    return services.filter(s => s.category === category);
  }

  async createBooking(request: Omit<LaundryBookingRequest, 'id' | 'createdAt' | 'status'>): Promise<LaundryBookingRequest> {
    const bookings = this.getBookings();
    const newBooking: LaundryBookingRequest = {
      ...request,
      id: `lb_${Date.now()}`,
      status: 'pickup_scheduled',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  }

  async getBookingsByCustomer(customerId: string): Promise<LaundryBookingRequest[]> {
    const bookings = this.getBookings();
    return bookings.filter(b => b.customerId === customerId);
  }

  async getAllBookings(): Promise<LaundryBookingRequest[]> {
    return this.getBookings();
  }

  async updateBookingStatus(bookingId: string, status: LaundryBookingRequest['status']): Promise<LaundryBookingRequest | null> {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return null;
    bookings[index].status = status;
    this.saveBookings(bookings);
    return bookings[index];
  }
}

export const laundryService: ILaundryService = new MockLaundryService();
