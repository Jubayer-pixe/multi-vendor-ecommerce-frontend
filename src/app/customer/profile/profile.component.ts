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

  name: string = 'Jubayer Ahmed';
  email: string = 'jubayer@example.com';
  phone: string = '017XXXXXXXX';

  address: string = 'House 10, Road 5';
  city: string = 'Dhaka';
  postalCode: string = '1200';

  accountStatus: string = 'Active';

  isEditMode: boolean = false;

  editProfile(): void {
    this.isEditMode = true;
  }

  saveProfile(): void {
    this.isEditMode = false;

    alert('Profile updated successfully!');
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

}