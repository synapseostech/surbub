import { Business, BusinessCategory } from '@/types/business';
import { MOCK_RESTAURANTS } from '@/data/mock/restaurants';
import { MOCK_PHARMACIES } from '@/data/mock/pharmacies';
import { MOCK_LAUNDRY_PROVIDERS } from '@/data/mock/laundry';
import { BusinessAnalytics } from '@/types/analytics';

export interface IBusinessService {
  getAllBusinesses(category?: BusinessCategory): Promise<Business[]>;
  getBusinessById(id: string): Promise<Business | null>;
  searchBusinesses(query: string): Promise<Business[]>;
  getBusinessAnalytics(businessId: string): Promise<BusinessAnalytics>;
}

class MockBusinessService implements IBusinessService {
  private getCombinedList(): Business[] {
    return [
      ...MOCK_RESTAURANTS,
      ...MOCK_PHARMACIES,
      ...MOCK_LAUNDRY_PROVIDERS,
    ];
  }

  async getAllBusinesses(category?: BusinessCategory): Promise<Business[]> {
    const list = this.getCombinedList();
    if (!category || category === ('all' as any)) return list;
    return list.filter(b => b.category === category);
  }

  async getBusinessById(id: string): Promise<Business | null> {
    return this.getCombinedList().find(b => b.id === id) || null;
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getCombinedList();
    return this.getCombinedList().filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.tagline.toLowerCase().includes(q) || 
      b.description.toLowerCase().includes(q) ||
      b.location.neighborhood.toLowerCase().includes(q)
    );
  }

  async getBusinessAnalytics(businessId: string): Promise<BusinessAnalytics> {
    return {
      totalRevenueUGX: 2450000,
      totalOrders: 118,
      averageOrderValueUGX: 20760,
      customerRating: 4.8,
      recentOrdersCount: 14,
      topSellingItems: [
        { name: 'Special Ankole Goat Muchomo Platter', count: 48, totalUGX: 1056000 },
        { name: 'Kalo with Eshabwe & Smoked Beef', count: 32, totalUGX: 576000 },
        { name: 'Chicken Luwombo with Matooke', count: 26, totalUGX: 624000 },
      ],
    };
  }
}

export const businessService: IBusinessService = new MockBusinessService();
