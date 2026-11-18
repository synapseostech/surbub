import { User, DemoRole, AuthState } from '@/types/auth';
import { DEMO_USERS } from '@/data/mock/demo-accounts';
import { getStoredItem, setStoredItem } from './storage';

const STORAGE_KEY = 'suburbplus_current_user_role';

export interface IAuthService {
  getCurrentUser(): Promise<User>;
  switchRole(role: DemoRole): Promise<User>;
  getAvailableRoles(): DemoRole[];
  getRoleUser(role: DemoRole): User;
  updateProfile(updates: Partial<User>): Promise<User>;
}

class MockAuthService implements IAuthService {
  private currentRole: DemoRole = 'customer';

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentRole = getStoredItem<DemoRole>(STORAGE_KEY, 'customer');
    }
  }

  async getCurrentUser(): Promise<User> {
    const role = getStoredItem<DemoRole>(STORAGE_KEY, this.currentRole);
    return DEMO_USERS[role];
  }

  async switchRole(role: DemoRole): Promise<User> {
    this.currentRole = role;
    setStoredItem(STORAGE_KEY, role);
    return DEMO_USERS[role];
  }

  getAvailableRoles(): DemoRole[] {
    return ['customer', 'restaurant_owner', 'pharmacy_owner', 'laundry_owner', 'rider', 'admin'];
  }

  getRoleUser(role: DemoRole): User {
    return DEMO_USERS[role];
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = await this.getCurrentUser();
    const updated = { ...current, ...updates };
    DEMO_USERS[this.currentRole] = updated;
    return updated;
  }
}

export const authService: IAuthService = new MockAuthService();
