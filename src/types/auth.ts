export type DemoRole = 
  | 'customer' 
  | 'restaurant_owner' 
  | 'pharmacy_owner' 
  | 'laundry_owner' 
  | 'rider' 
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: DemoRole;
  avatarUrl?: string;
  location?: string;
  businessId?: string;
  businessName?: string;
}

export interface AuthState {
  user: User | null;
  role: DemoRole;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}
