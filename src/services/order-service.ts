import { Order, CartItem, OrderStatus, PaymentMethod } from '@/types/order';
import { INITIAL_MOCK_ORDERS } from '@/data/mock/orders';
import { getStoredItem, setStoredItem } from './storage';

const ORDERS_STORAGE_KEY = 'suburbplus_orders';

export interface CreateOrderParams {
  customerId: string;
  customerName: string;
  customerPhone: string;
  merchantId: string;
  merchantName: string;
  items: CartItem[];
  subtotalUGX: number;
  deliveryFeeUGX: number;
  serviceFeeUGX: number;
  totalUGX: number;
  deliveryAddress: string;
  deliveryNeighborhood: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
}

export interface IOrderService {
  createOrder(params: CreateOrderParams): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getCustomerOrders(customerId: string): Promise<Order[]>;
  getMerchantOrders(merchantId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | null>;
}

class MockOrderService implements IOrderService {
  private getOrders(): Order[] {
    return getStoredItem<Order[]>(ORDERS_STORAGE_KEY, INITIAL_MOCK_ORDERS);
  }

  private saveOrders(orders: Order[]): void {
    setStoredItem(ORDERS_STORAGE_KEY, orders);
  }

  async createOrder(params: CreateOrderParams): Promise<Order> {
    const orders = this.getOrders();
    const orderId = `ord_sub_${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      id: orderId,
      customerId: params.customerId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      merchantId: params.merchantId,
      merchantName: params.merchantName,
      merchantType: 'food',
      items: params.items,
      subtotalUGX: params.subtotalUGX,
      deliveryFeeUGX: params.deliveryFeeUGX,
      serviceFeeUGX: params.serviceFeeUGX,
      totalUGX: params.totalUGX,
      deliveryAddress: params.deliveryAddress,
      deliveryNeighborhood: params.deliveryNeighborhood,
      specialInstructions: params.specialInstructions,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cash_on_delivery' || params.paymentMethod === 'cash_pickup' ? 'cash_due' : 'completed',
      status: 'placed',
      statusHistory: [
        {
          status: 'placed',
          timestamp: now,
          note: `Demo order placed via ${params.paymentMethod.replace('_', ' ').toUpperCase()}`,
        },
      ],
      riderId: 'user_rider_01',
      riderName: 'Ronald Katushabe',
      riderPhone: '+256 774 901 234',
      createdAt: now,
      isSimulatedDemo: true,
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    const orders = this.getOrders();
    return orders.filter(o => o.customerId === customerId);
  }

  async getMerchantOrders(merchantId: string): Promise<Order[]> {
    const orders = this.getOrders();
    return orders.filter(o => o.merchantId === merchantId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.getOrders();
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | null> {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    orders[index].status = status;
    orders[index].statusHistory.push({
      status,
      timestamp: now,
      note: note || `Status updated to ${status}`,
    });

    this.saveOrders(orders);
    return orders[index];
  }
}

export const orderService: IOrderService = new MockOrderService();
