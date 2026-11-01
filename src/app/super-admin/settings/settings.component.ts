import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-super-admin-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SuperAdminSettingsComponent {
  platformName = 'MVE Marketplace';
  supportEmail = 'support@mve.com';
  vendorApprovalRequired = true;
  maintenanceMode = false;

  save(): void {
    console.log('Super admin settings:', {
      platformName: this.platformName,
      supportEmail: this.supportEmail,
      vendorApprovalRequired: this.vendorApprovalRequired,
      maintenanceMode: this.maintenanceMode
    });
    alert('Settings saved locally. Connect this form to the backend when the API is ready.');
  }
}
