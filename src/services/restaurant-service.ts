import { Restaurant, MenuItem, FoodCategory } from '@/types/restaurant';
import { MOCK_RESTAURANTS, MOCK_MENU_ITEMS } from '@/data/mock/restaurants';

export interface IRestaurantService {
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | null>;
  searchRestaurants(query: string, cuisine?: string): Promise<Restaurant[]>;
  getMenuItems(restaurantId: string, category?: FoodCategory): Promise<MenuItem[]>;
  getMenuItemById(restaurantId: string, itemId: string): Promise<MenuItem | null>;
  getFeaturedRestaurants(): Promise<Restaurant[]>;
}

class MockRestaurantService implements IRestaurantService {
  async getAllRestaurants(): Promise<Restaurant[]> {
    return MOCK_RESTAURANTS;
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
    if (!restaurant) return null;
    return {
      ...restaurant,
      menu: MOCK_MENU_ITEMS[id] || [],
    };
  }

  async searchRestaurants(query: string, cuisine?: string): Promise<Restaurant[]> {
    const q = query.toLowerCase().trim();
    return MOCK_RESTAURANTS.filter(r => {
      const matchesQuery = !q || 
        r.name.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q));
      
      const matchesCuisine = !cuisine || cuisine === 'all' || 
        r.cuisine.some(c => c.toLowerCase() === cuisine.toLowerCase());
        
      return matchesQuery && matchesCuisine;
    });
  }

  async getMenuItems(restaurantId: string, category?: FoodCategory): Promise<MenuItem[]> {
    const items = MOCK_MENU_ITEMS[restaurantId] || [];
    if (!category || category === ('all' as any)) return items;
    return items.filter(item => item.category === category);
  }

  async getMenuItemById(restaurantId: string, itemId: string): Promise<MenuItem | null> {
    const items = MOCK_MENU_ITEMS[restaurantId] || [];
    return items.find(i => i.id === itemId) || null;
  }

  async getFeaturedRestaurants(): Promise<Restaurant[]> {
    return MOCK_RESTAURANTS.filter(r => r.featured);
  }
}

export const restaurantService: IRestaurantService = new MockRestaurantService();
