import { PharmacyWithComparison, PharmacyProduct, PharmacyPriceListing, HealthCategory } from '@/types/pharmacy';
import { MOCK_PHARMACIES, MOCK_PHARMACY_PRODUCTS, MOCK_PRICE_COMPARISONS } from '@/data/mock/pharmacies';

export interface PharmacyInquiry {
  id: string;
  pharmacyId: string;
  productId?: string;
  customerName: string;
  customerPhone: string;
  message: string;
  type: 'stock_check' | 'price_inquiry' | 'general_advice';
  status: 'sent' | 'responded';
  createdAt: string;
}

export interface IPharmacyService {
  getAllPharmacies(): Promise<PharmacyWithComparison[]>;
  getPharmacyById(id: string): Promise<PharmacyWithComparison | null>;
  getAllProducts(category?: HealthCategory): Promise<PharmacyProduct[]>;
  getProductById(id: string): Promise<PharmacyProduct | null>;
  getPriceComparison(productId: string): Promise<PharmacyPriceListing[]>;
  searchProducts(query: string, category?: HealthCategory): Promise<PharmacyProduct[]>;
  sendInquiry(inquiry: Omit<PharmacyInquiry, 'id' | 'status' | 'createdAt'>): Promise<PharmacyInquiry>;
}

class MockPharmacyService implements IPharmacyService {
  async getAllPharmacies(): Promise<PharmacyWithComparison[]> {
    return MOCK_PHARMACIES;
  }

  async getPharmacyById(id: string): Promise<PharmacyWithComparison | null> {
    return MOCK_PHARMACIES.find(p => p.id === id) || null;
  }

  async getAllProducts(category?: HealthCategory): Promise<PharmacyProduct[]> {
    if (!category || category === ('all' as any)) return MOCK_PHARMACY_PRODUCTS;
    return MOCK_PHARMACY_PRODUCTS.filter(p => p.category === category);
  }

  async getProductById(id: string): Promise<PharmacyProduct | null> {
    return MOCK_PHARMACY_PRODUCTS.find(p => p.id === id) || null;
  }

  async getPriceComparison(productId: string): Promise<PharmacyPriceListing[]> {
    return MOCK_PRICE_COMPARISONS[productId] || [];
  }

  async searchProducts(query: string, category?: HealthCategory): Promise<PharmacyProduct[]> {
    const q = query.toLowerCase().trim();
    return MOCK_PHARMACY_PRODUCTS.filter(p => {
      const matchesQ = !q || 
        p.name.toLowerCase().includes(q) || 
        (p.genericName && p.genericName.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);
      const matchesCat = !category || category === ('all' as any) || p.category === category;
      return matchesQ && matchesCat;
    });
  }

  async sendInquiry(inquiry: Omit<PharmacyInquiry, 'id' | 'status' | 'createdAt'>): Promise<PharmacyInquiry> {
    const newInquiry: PharmacyInquiry = {
      ...inquiry,
      id: `inq_${Date.now()}`,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };
    return newInquiry;
  }
}

export const pharmacyService: IPharmacyService = new MockPharmacyService();
