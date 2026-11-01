import { Component } from '@angular/core';
import { FooterComponent } from '../../../layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../layout/navbar/navbar.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [FooterComponent, RouterOutlet, NavbarComponent],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.scss'
})
export class CustomerLayoutComponent {

}
