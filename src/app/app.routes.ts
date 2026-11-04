import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // =====================================================
  // LOGIN
  // =====================================================

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
  },

  // =====================================================
  // REGISTER
  // =====================================================

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (c) => c.RegisterComponent,
      ),
  },

  // =====================================================
  // CUSTOMER PANEL
  // =====================================================

  {
    path: '',

    loadComponent: () =>
      import('./customer/layout/customer-layout/customer-layout.component').then(
        (c) => c.CustomerLayoutComponent,
      ),

    children: [
      // HOME
      {
        path: '',
        loadComponent: () =>
          import('./customer/home/home.component').then((c) => c.HomeComponent),
      },

      // PRODUCTS
      {
        path: 'products',
        loadComponent: () =>
          import('./customer/products/products.component').then(
            (c) => c.ProductsComponent,
          ),
      },

      // PRODUCT DETAILS
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./customer/product-details/product-details.component').then(
            (c) => c.ProductDetailsComponent,
          ),
      },

      // CATEGORIES
      {
        path: 'categories',
        redirectTo: 'products',
        pathMatch: 'full',
      },

      // CART
      {
        path: 'cart',
        loadComponent: () =>
          import('./customer/cart/cart.component').then((c) => c.CartComponent),
      },

      // WISHLIST
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./customer/wishlist/wishlist.component').then(
            (c) => c.WishlistComponent,
          ),
      },

      // CHECKOUT
      {
        path: 'checkout',
        loadComponent: () =>
          import('./customer/checkout/checkout.component').then(
            (c) => c.CheckoutComponent,
          ),
      },

      // ORDERS
      {
        path: 'orders',
        canActivate: [authGuard, roleGuard(['CUSTOMER'])],

        loadComponent: () =>
          import('./customer/orders/orders.component').then(
            (c) => c.OrdersComponent,
          ),
      },

      // ORDER DETAILS
      {
        path: 'orders/:id',
        canActivate: [authGuard, roleGuard(['CUSTOMER'])],

        loadComponent: () =>
          import('./customer/order-details/order-details.component').then(
            (c) => c.OrderDetailsComponent,
          ),
      },

      // ORDER SUCCESS
      {
        path: 'order-success',
        canActivate: [authGuard, roleGuard(['CUSTOMER'])],

        loadComponent: () =>
          import('./customer/order-success/order-success.component').then(
            (c) => c.OrderSuccessComponent,
          ),
      },

      // PROFILE
      {
        path: 'profile',
        canActivate: [authGuard, roleGuard(['CUSTOMER'])],

        loadComponent: () =>
          import('./customer/profile/profile.component').then(
            (c) => c.ProfileComponent,
          ),
      },
    ],
  },

  // {
  //   path: '',
  //   canActivate: [authGuard, roleGuard(['CUSTOMER'])],

  //   loadComponent: () =>
  //     import('./customer/layout/customer-layout/customer-layout.component').then(
  //       (c) => c.CustomerLayoutComponent,
  //     ),

  //   children: [
  //     // HOME
  //     {
  //       path: '',
  //       loadComponent: () =>
  //         import('./customer/home/home.component').then((c) => c.HomeComponent),
  //     },

  //     // PRODUCTS
  //     {
  //       path: 'products',
  //       loadComponent: () =>
  //         import('./customer/products/products.component').then(
  //           (c) => c.ProductsComponent,
  //         ),
  //     },

  //     // PRODUCT DETAILS
  //     {
  //       path: 'products/:id',
  //       loadComponent: () =>
  //         import('./customer/product-details/product-details.component').then(
  //           (c) => c.ProductDetailsComponent,
  //         ),
  //     },

  //     // CATEGORIES
  //     {
  //       path: 'categories',
  //       redirectTo: 'products',
  //       pathMatch: 'full',
  //     },

  //     // CART
  //     {
  //       path: 'cart',
  //       loadComponent: () =>
  //         import('./customer/cart/cart.component').then((c) => c.CartComponent),
  //     },

  //     // WISHLIST
  //     {
  //       path: 'wishlist',
  //       loadComponent: () =>
  //         import('./customer/wishlist/wishlist.component').then(
  //           (c) => c.WishlistComponent,
  //         ),
  //     },

  //     // CHECKOUT
  //     {
  //       path: 'checkout',
  //       loadComponent: () =>
  //         import('./customer/checkout/checkout.component').then(
  //           (c) => c.CheckoutComponent,
  //         ),
  //     },

  //     // ORDERS
  //     {
  //       path: 'orders',
  //       loadComponent: () =>
  //         import('./customer/orders/orders.component').then(
  //           (c) => c.OrdersComponent,
  //         ),
  //     },

  //     // ORDER DETAILS
  //     {
  //       path: 'orders/:id',
  //       loadComponent: () =>
  //         import('./customer/order-details/order-details.component').then(
  //           (c) => c.OrderDetailsComponent,
  //         ),
  //     },

  //     // ORDER SUCCESS
  //     {
  //       path: 'order-success',
  //       loadComponent: () =>
  //         import('./customer/order-success/order-success.component').then(
  //           (c) => c.OrderSuccessComponent,
  //         ),
  //     },

  //     // PROFILE
  //     {
  //       path: 'profile',
  //       loadComponent: () =>
  //         import('./customer/profile/profile.component').then(
  //           (c) => c.ProfileComponent,
  //         ),
  //     },
  //   ],
  // },

  // =====================================================
  // SUPER ADMIN PANEL
  // =====================================================

  {
    path: 'super-admin',

    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])],

    loadComponent: () =>
      import('./super-admin/layout/layout.component').then(
        (c) => c.SuperAdminLayoutComponent,
      ),

    children: [
      // DASHBOARD
      {
        path: '',
        loadComponent: () =>
          import('./super-admin/dashboard/dashboard.component').then(
            (c) => c.SuperAdminDashboardComponent,
          ),
      },

      // ADMINS
      {
        path: 'admins',
        loadComponent: () =>
          import('./super-admin/admins/admins.component').then(
            (c) => c.SuperAdminAdminsComponent,
          ),
      },

      // VENDORS
      {
        path: 'vendors',
        loadComponent: () =>
          import('./super-admin/vendors/vendors.component').then(
            (c) => c.SuperAdminVendorsComponent,
          ),
      },

      // SETTINGS
      {
        path: 'settings',
        loadComponent: () =>
          import('./super-admin/settings/settings.component').then(
            (c) => c.SuperAdminSettingsComponent,
          ),
      },
    ],
  },

  // =====================================================
  // VENDOR PANEL
  // =====================================================

  {
    path: 'vendor',

    canActivate: [authGuard, roleGuard(['VENDOR'])],

    loadComponent: () =>
      import('./vendor/layout/vendor-layout/vendor-layout.component').then(
        (c) => c.VendorLayoutComponent,
      ),

    children: [
      // DASHBOARD
      {
        path: '',
        loadComponent: () =>
          import('./vendor/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },

      // PRODUCTS
      {
        path: 'products',
        loadComponent: () =>
          import('./vendor/products/products.component').then(
            (c) => c.ProductsComponent,
          ),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./vendor/products/add-product/add-product.component').then(
            (c) => c.AddProductComponent,
          ),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./vendor/products/edit-product/edit-product.component').then(
            (c) => c.EditProductComponent,
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./vendor/products/product-details/product-details.component').then(
            (c) => c.ProductDetailsComponent,
          ),
      },

      // ORDERS
      {
        path: 'orders',
        loadComponent: () =>
          import('./vendor/orders/orders.component').then(
            (c) => c.OrdersComponent,
          ),
      },

      // INVENTORY
      {
        path: 'inventory',
        loadComponent: () =>
          import('./vendor/inventory/inventory.component').then(
            (c) => c.InventoryComponent,
          ),
      },

      // WALLET
      {
        path: 'wallet',
        loadComponent: () =>
          import('./vendor/wallet/wallet.component').then(
            (c) => c.WalletComponent,
          ),
      },

      // PROFILE
      {
        path: 'profile',
        loadComponent: () =>
          import('./vendor/profile/profile.component').then(
            (c) => c.ProfileComponent,
          ),
      },
    ],
  },

  // =====================================================
  // DELIVERY PANEL
  // =====================================================

  {
    path: 'delivery',

    canActivate: [authGuard, roleGuard(['DELIVERY'])],

    loadComponent: () =>
      import('./delivery/layout/layout.component').then(
        (c) => c.DeliveryLayoutComponent,
      ),

    children: [
      // DASHBOARD
      {
        path: '',
        loadComponent: () =>
          import('./delivery/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },

      // ORDERS
      {
        path: 'orders',
        loadComponent: () =>
          import('./delivery/orders/orders.component').then(
            (c) => c.OrdersComponent,
          ),
      },

      // ORDER DETAILS
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./delivery/order-details/order-details.component').then(
            (c) => c.OrderDetailsComponent,
          ),
      },

      // PICKUPS
      {
        path: 'pickups',
        loadComponent: () =>
          import('./delivery/pickups/pickups.component').then(
            (c) => c.PickupsComponent,
          ),
      },

      // PROFILE
      {
        path: 'profile',
        loadComponent: () =>
          import('./delivery/profile/profile.component').then(
            (c) => c.ProfileComponent,
          ),
      },

      // NOTIFICATIONS
      {
        path: 'notifications',
        loadComponent: () =>
          import('./delivery/notifications/notifications.component').then(
            (c) => c.NotificationsComponent,
          ),
      },

      // SETTINGS
      {
        path: 'settings',
        loadComponent: () =>
          import('./delivery/settings/settings.component').then(
            (c) => c.SettingsComponent,
          ),
      },
    ],
  },

  // =====================================================
  // ADMIN PANEL
  // =====================================================

  {
    path: 'admin',

    canActivate: [authGuard, roleGuard(['ADMIN', 'SUPER_ADMIN'])],

    loadComponent: () =>
      import('./admin/layout/admin-layout/admin-layout.component').then(
        (c) => c.AdminLayoutComponent,
      ),

    children: [
      {
        path: 'users',
        redirectTo: 'customers',
        pathMatch: 'full',
      },
      // DASHBOARD
      {
        path: '',
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },

      // VENDORS
      {
        path: 'vendors',
        loadComponent: () =>
          import('./admin/vendors/vendors.component').then(
            (c) => c.VendorsComponent,
          ),
      },

      // CUSTOMERS
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/customers/customers.component').then(
            (c) => c.CustomersComponent,
          ),
      },

      // CATEGORIES
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin/categories/categories.component').then(
            (c) => c.CategoriesComponent,
          ),
      },

      // BRANDS
      {
        path: 'brands',
        loadComponent: () =>
          import('./admin/brands/brands.component').then(
            (c) => c.BrandsComponent,
          ),
      },

      // PRODUCTS
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/products/products.component').then(
            (c) => c.ProductsComponent,
          ),
      },

      {
        path: 'inventory',
        loadComponent: () =>
          import('./admin/inventory/inventory.component').then(
            (c) => c.AdminInventoryComponent,
          ),
      },

      // ORDERS
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/orders/orders.component').then(
            (c) => c.OrdersComponent,
          ),
      },

      // PAYMENTS
      {
        path: 'payments',
        loadComponent: () =>
          import('./admin/payments/payments.component').then(
            (c) => c.PaymentsComponent,
          ),
      },

      // WITHDRAWALS
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./admin/withdrawals/withdrawals.component').then(
            (c) => c.WithdrawalsComponent,
          ),
      },

      // REPORTS
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/reports/reports.component').then(
            (c) => c.ReportsComponent,
          ),
      },
    ],
  },

  // =====================================================
  // UNKNOWN URL
  // =====================================================

  {
    path: '**',
    redirectTo: '',
  },
];
