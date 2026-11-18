'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem } from '@/services/storage';

const LOCATION_STORAGE_KEY = 'suburbplus_selected_neighborhood';

export interface Neighborhood {
  id: string;
  name: string;
  district: string;
  subCounty: string;
  landmark: string;
}

export const ISHAKA_BUSHENYI_NEIGHBORHOODS: Neighborhood[] = [
  { id: 'ishaka_main', name: 'Ishaka Main Town', district: 'Bushenyi', subCounty: 'Ishaka Division', landmark: 'Roundabout & Stanbic Bank' },
  { id: 'kiu_campus', name: 'KIU Campus & Hostels', district: 'Bushenyi', subCounty: 'Ishaka Division', landmark: 'Kampala International University' },
  { id: 'hospital_rd', name: 'Ishaka Hospital Road', district: 'Bushenyi', subCounty: 'Ishaka Division', landmark: 'Ishaka Adventist Hospital' },
  { id: 'bassajjabalaba', name: 'Bassajjabalaba Centre', district: 'Bushenyi', subCounty: 'Ishaka Division', landmark: 'Bassajjabalaba Mosque & Trading Centre' },
  { id: 'bushenyi_central', name: 'Bushenyi Central Municipal', district: 'Bushenyi', subCounty: 'Central Division', landmark: 'Municipal Council Offices' },
  { id: 'kizinda', name: 'Kizinda Trading Centre', district: 'Bushenyi', subCounty: 'Kizinda-Kigoma', landmark: 'Kizinda Produce Market' },
  { id: 'nyakabirizi', name: 'Nyakabirizi Trading Centre', district: 'Bushenyi', subCounty: 'Nyakabirizi Division', landmark: 'Nyakabirizi Tea Hub' },
];

interface LocationContextType {
  selectedLocation: Neighborhood;
  setSelectedLocation: (location: Neighborhood) => void;
  allLocations: Neighborhood[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<Neighborhood>(ISHAKA_BUSHENYI_NEIGHBORHOODS[0]);

  useEffect(() => {
    const saved = getStoredItem<Neighborhood>(LOCATION_STORAGE_KEY, ISHAKA_BUSHENYI_NEIGHBORHOODS[0]);
    setSelectedLocationState(saved);
  }, []);

  const setSelectedLocation = (location: Neighborhood) => {
    setSelectedLocationState(location);
    setStoredItem(LOCATION_STORAGE_KEY, location);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        allLocations: ISHAKA_BUSHENYI_NEIGHBORHOODS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
