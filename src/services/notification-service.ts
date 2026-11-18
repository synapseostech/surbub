import { NotificationItem } from '@/types/notification';
import { INITIAL_MOCK_NOTIFICATIONS } from '@/data/mock/notifications';
import { getStoredItem, setStoredItem } from './storage';

const NOTIF_STORAGE_KEY = 'suburbplus_notifications';

export interface INotificationService {
  getNotifications(userId: string): Promise<NotificationItem[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

class MockNotificationService implements INotificationService {
  private getList(): NotificationItem[] {
    return getStoredItem<NotificationItem[]>(NOTIF_STORAGE_KEY, INITIAL_MOCK_NOTIFICATIONS);
  }

  private saveList(list: NotificationItem[]): void {
    setStoredItem(NOTIF_STORAGE_KEY, list);
  }

  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return this.getList().filter(n => n.userId === userId || n.userId === 'user_cust_01');
  }

  async markAsRead(notificationId: string): Promise<void> {
    const list = this.getList();
    const item = list.find(n => n.id === notificationId);
    if (item) {
      item.read = true;
      this.saveList(list);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const list = this.getList();
    list.forEach(n => {
      if (n.userId === userId || n.userId === 'user_cust_01') {
        n.read = true;
      }
    });
    this.saveList(list);
  }
}

export const notificationService: INotificationService = new MockNotificationService();
