import { NotificationItem } from '@/types/notification';

export const INITIAL_MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'user_cust_01',
    title: 'Order Delivered Successfully!',
    message: 'Your order from Ankole Spice Kitchen & Grill has arrived. Enjoy your meal!',
    type: 'order',
    read: false,
    createdAt: '2026-11-18 12:52',
    link: '/account?tab=orders',
  },
  {
    id: 'notif_02',
    userId: 'user_cust_01',
    title: 'Rider Assigned to Your Trip',
    message: 'Ronald Katushabe on Bajaj Boxer (UFL 429K) is on the way to KIU Gate.',
    type: 'ride',
    read: true,
    createdAt: '2026-11-18 09:18',
    link: '/rides',
  },
  {
    id: 'notif_03',
    userId: 'user_cust_01',
    title: 'Sparkle Laundry Pickup Scheduled',
    message: 'Pickup confirmed for tomorrow at 10:00 AM at KIU Girls Hostel.',
    type: 'laundry',
    read: true,
    createdAt: '2026-11-18 11:32',
    link: '/account?tab=laundry',
  },
  {
    id: 'notif_04',
    userId: 'user_cust_01',
    title: 'Welcome to SUBURB+ Ishaka–Bushenyi!',
    message: 'Discover food, health supplies, laundry and swift local rides all in one place.',
    type: 'promo',
    read: true,
    createdAt: '2026-11-17 08:00',
    link: '/',
  },
];
