export interface Review {
  id: string;
  targetId: string; // Business ID, Rider ID, etc.
  targetType: 'restaurant' | 'pharmacy' | 'laundry' | 'rider';
  authorName: string;
  authorLocation?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  helpfulCount: number;
}
