import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    RouterLink,
    DatePipe
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  totalOrders: number = 12;

  pendingOrders: number = 4;

  pickedUpOrders: number = 2;

  deliveredOrders: number = 6;

  currentDate: Date = new Date();

}