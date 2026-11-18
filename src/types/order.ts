import { MenuItem } from './restaurant';

export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'cash_on_delivery' | 'cash_pickup';

export type OrderType = 'food' | 'pharmacy_inquiry' | 'laundry' | 'rides' | 'vehicle_hire';

export type OrderStatus = 
  | 'placed' 
  | 'confirmed_by_merchant' 
  | 'preparing' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface CartItem {
  id: string; // unique item cart id
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  priceUGX: number;
  quantity: number;
  selectedOptions?: string[];
  itemTotalUGX: number;
  image?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  merchantId: string;
  merchantName: string;
  merchantType: OrderType;
  items: CartItem[];
  subtotalUGX: number;
  deliveryFeeUGX: number;
  serviceFeeUGX: number;
  totalUGX: number;
  deliveryAddress: string;
  deliveryNeighborhood: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'cash_due';
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note: string }[];
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  isSimulatedDemo: boolean;
}
