import { Business } from './business';

export type HealthCategory = 
  | 'otc_wellness' 
  | 'first_aid' 
  | 'vitamins_supplements' 
  | 'personal_care' 
  | 'mother_baby' 
  | 'medical_supplies';

export interface PharmacyProduct {
  id: string;
  name: string;
  genericName?: string;
  description: string;
  category: HealthCategory;
  standardPriceUGX: number;
  requiresPrescription: boolean; // If true, requires verified consultation/prescription via pharmacy directly
  isDemonstrationProduct: boolean;
  image: string;
  dosageForm?: string; // e.g. "Box of 20 Tablets", "100ml Syrup"
  usageNote?: string;
}

export interface PharmacyPriceListing {
  pharmacyId: string;
  pharmacyName: string;
  pharmacyLocation: string;
  priceUGX: number;
  availabilityLabel: 'In Stock' | 'Call to Confirm' | 'Limited Stock';
  isLicensedPartner: boolean;
}

export interface PharmacyWithComparison extends Business {
  licenseNumber: string;
  pharmacistInCharge: string;
  emergencyHotline?: string;
  dispensingDisclaimer: string;
}
