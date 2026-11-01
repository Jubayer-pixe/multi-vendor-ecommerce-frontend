import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DeliveryNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  time: string;
  orderId?: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  selectedFilter: string = 'ALL';

  notifications: DeliveryNotification[] = [

    {
      id: 1,
      title: 'New Order Assigned',
      message:
        'Order ORD-1008 has been assigned to you for delivery.',
      type: 'ORDER',
      time: '5 minutes ago',
      orderId: 'ORD-1008',
      isRead: false
    },

    {
      id: 2,
      title: 'Pickup Reminder',
      message:
        'Pickup for ORD-1001 is scheduled at 10:30 AM.',
      type: 'REMINDER',
      time: '20 minutes ago',
      orderId: 'ORD-1001',
      isRead: false
    },

    {
      id: 3,
      title: 'Order Picked Up',
      message:
        'You successfully picked up order ORD-1002.',
      type: 'SUCCESS',
      time: '1 hour ago',
      orderId: 'ORD-1002',
      isRead: true
    },

    {
      id: 4,
      title: 'Delivery Reminder',
      message:
        'Please complete the delivery of ORD-1003.',
      type: 'REMINDER',
      time: '2 hours ago',
      orderId: 'ORD-1003',
      isRead: false
    },

    {
      id: 5,
      title: 'Delivery Completed',
      message:
        'Order ORD-1005 has been successfully delivered.',
      type: 'SUCCESS',
      time: '3 hours ago',
      orderId: 'ORD-1005',
      isRead: true
    },

    {
      id: 6,
      title: 'Important Notice',
      message:
        'Please make sure all COD amounts are collected properly.',
      type: 'WARNING',
      time: '5 hours ago',
      isRead: false
    }

  ];


  constructor(
    private router: Router
  ) {}


  get filteredNotifications(): DeliveryNotification[] {

    if (this.selectedFilter === 'ALL') {
      return this.notifications;
    }

    if (this.selectedFilter === 'UNREAD') {
      return this.notifications.filter(
        notification => !notification.isRead
      );
    }

    if (this.selectedFilter === 'READ') {
      return this.notifications.filter(
        notification => notification.isRead
      );
    }

    return this.notifications.filter(
      notification =>
        notification.type === this.selectedFilter
    );
  }


  get unreadCount(): number {

    return this.notifications.filter(
      notification => !notification.isRead
    ).length;

  }


  get readCount(): number {

    return this.notifications.filter(
      notification => notification.isRead
    ).length;

  }


  markAsRead(
    notification: DeliveryNotification
  ): void {

    notification.isRead = true;

  }


  markAllAsRead(): void {

    this.notifications.forEach(
      notification => {
        notification.isRead = true;
      }
    );

    alert('All notifications marked as read.');

  }


  deleteNotification(
    notification: DeliveryNotification
  ): void {

    this.notifications =
      this.notifications.filter(
        item => item.id !== notification.id
      );

  }


  viewOrder(
    notification: DeliveryNotification
  ): void {

    if (!notification.orderId) {
      return;
    }

    notification.isRead = true;

    this.router.navigate([
      '/delivery/orders',
      notification.orderId
    ]);

  }


  getIcon(type: string): string {

    switch (type) {

      case 'ORDER':
        return 'bi-box-seam';

      case 'REMINDER':
        return 'bi-alarm';

      case 'SUCCESS':
        return 'bi-check-circle';

      case 'WARNING':
        return 'bi-exclamation-triangle';

      default:
        return 'bi-bell';

    }

  }


  getIconClass(type: string): string {

    switch (type) {

      case 'ORDER':
        return 'notification-order';

      case 'REMINDER':
        return 'notification-reminder';

      case 'SUCCESS':
        return 'notification-success';

      case 'WARNING':
        return 'notification-warning';

      default:
        return 'notification-default';

    }

  }

}