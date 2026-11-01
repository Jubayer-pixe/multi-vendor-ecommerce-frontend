import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  // =========================
  // Availability
  // =========================

  isOnline: boolean = true;

  autoAcceptOrders: boolean = false;

  // =========================
  // Notifications
  // =========================

  orderNotification: boolean = true;

  pickupReminder: boolean = true;

  deliveryReminder: boolean = true;

  promotionalNotification: boolean = false;

  soundNotification: boolean = true;

  // =========================
  // Delivery Preferences
  // =========================

  deliveryRadius: number = 10;

  preferredArea: string = 'Dhaka';

  vehicleType: string = 'Motorcycle';

  // =========================
  // COD
  // =========================

  acceptCOD: boolean = true;

  codLimit: number = 10000;

  // =========================
  // Security
  // =========================

  currentPassword: string = '';

  newPassword: string = '';

  confirmPassword: string = '';

  // =========================
  // Status
  // =========================

  toggleOnline(): void {

    this.isOnline = !this.isOnline;

    alert(
      this.isOnline
        ? 'You are now Online.'
        : 'You are now Offline.'
    );
  }


  saveSettings(): void {

    if (
      this.newPassword &&
      this.newPassword !== this.confirmPassword
    ) {
      alert('New password and confirm password do not match.');
      return;
    }

    console.log('Settings:', {
      isOnline: this.isOnline,
      autoAcceptOrders: this.autoAcceptOrders,

      orderNotification: this.orderNotification,
      pickupReminder: this.pickupReminder,
      deliveryReminder: this.deliveryReminder,
      promotionalNotification:
        this.promotionalNotification,
      soundNotification: this.soundNotification,

      deliveryRadius: this.deliveryRadius,
      preferredArea: this.preferredArea,
      vehicleType: this.vehicleType,

      acceptCOD: this.acceptCOD,
      codLimit: this.codLimit
    });

    alert('Settings saved successfully!');
  }


  resetSettings(): void {

    this.isOnline = true;

    this.autoAcceptOrders = false;

    this.orderNotification = true;

    this.pickupReminder = true;

    this.deliveryReminder = true;

    this.promotionalNotification = false;

    this.soundNotification = true;

    this.deliveryRadius = 10;

    this.preferredArea = 'Dhaka';

    this.vehicleType = 'Motorcycle';

    this.acceptCOD = true;

    this.codLimit = 10000;

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

    alert('Settings reset successfully.');
  }


  changePassword(): void {

    if (!this.currentPassword) {
      alert('Please enter your current password.');
      return;
    }

    if (!this.newPassword) {
      alert('Please enter a new password.');
      return;
    }

    if (
      this.newPassword !==
      this.confirmPassword
    ) {
      alert(
        'New password and confirm password do not match.'
      );
      return;
    }

    alert('Password changed successfully.');

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

}
