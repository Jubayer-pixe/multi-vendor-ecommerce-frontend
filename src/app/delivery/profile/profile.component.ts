import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  isEditMode: boolean = false;

  name: string = 'Jubayer Ahmed';
  email: string = 'delivery@gmail.com';
  phone: string = '01712345678';

  address: string = 'Dhanmondi, Dhaka';

  vehicleType: string = 'Motorcycle';
  vehicleNumber: string = 'DHAKA-METRO-123456';

  joinDate: string = '01 January 2026';

  totalDeliveries: number = 128;
  completedDeliveries: number = 112;
  pendingDeliveries: number = 8;
  cancelledDeliveries: number = 8;

  rating: number = 4.8;

  isOnline: boolean = true;


  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }


  saveProfile(): void {

    this.isEditMode = false;

    alert('Profile updated successfully!');
  }


  cancelEdit(): void {
    this.isEditMode = false;
  }


  toggleOnline(): void {

    this.isOnline = !this.isOnline;

    if (this.isOnline) {
      alert('You are now Online');
    } else {
      alert('You are now Offline');
    }
  }


  logout(): void {

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    alert('Logged out successfully!');
  }

}
