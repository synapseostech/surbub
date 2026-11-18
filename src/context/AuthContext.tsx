'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DemoRole } from '@/types/auth';
import { authService } from '@/services/auth-service';
import { DEMO_USERS } from '@/data/mock/demo-accounts';

interface AuthContextType {
  user: User;
  role: DemoRole;
  switchRole: (role: DemoRole) => Promise<void>;
  availableRoles: { role: DemoRole; label: string; description: string; name: string }[];
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_METADATA: { role: DemoRole; label: string; description: string; name: string }[] = [
  { role: 'customer', label: 'Customer', description: 'Browse, order food, compare pharmacy, book rides & laundry', name: 'Brenda Kemigisha' },
  { role: 'restaurant_owner', label: 'Restaurant Owner', description: 'Manage food orders, menu items & kitchen status', name: 'Dan Mugisha (Ankole Spice)' },
  { role: 'pharmacy_owner', label: 'Pharmacy Owner', description: 'View inquiries, list OTC items & check NDA disclaimers', name: 'Pharm. Grace Ainembabazi' },
  { role: 'laundry_owner', label: 'Laundry Owner', description: 'Manage laundry orders, pickup schedules & pressing queue', name: 'Brian Tumusiime (Sparkle)' },
  { role: 'rider', label: 'Rider / Driver', description: 'Accept delivery jobs, toggle availability & view earnings', name: 'Ronald Katushabe' },
  { role: 'admin', label: 'Platform Admin', description: 'Oversee businesses, approve listings, track GMV & rides', name: 'Emmanuel Twinomujuni' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<DemoRole>('customer');
  const [user, setUser] = useState<User>(DEMO_USERS.customer);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      setUser(u);
      setRole(u.role);
    });
  }, []);

  const switchRole = async (newRole: DemoRole) => {
    const updatedUser = await authService.switchRole(newRole);
    setRole(newRole);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        switchRole,
        availableRoles: ROLE_METADATA,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
