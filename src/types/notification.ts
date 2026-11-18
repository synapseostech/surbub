export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'ride' | 'promo' | 'system' | 'laundry';
  read: boolean;
  createdAt: string;
  link?: string;
}
