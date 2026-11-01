import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


// =====================================================
// INVENTORY PRODUCT INTERFACE
// =====================================================

interface InventoryProduct {
  id: number;
  name: string;
  category: string;
  sku: string;
  stock: number;
  lowStockLevel: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}


// =====================================================
// STOCK HISTORY INTERFACE
// =====================================================

interface StockHistory {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  type: 'Stock In' | 'Stock Out';
  quantity: number;
  previousStock: number;
  currentStock: number;
  reason: string;
  date: string;
}


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {


  // =====================================================
  // INVENTORY FILTERS
  // =====================================================

  searchText: string = '';

  selectedCategory: string = 'All';

  selectedStatus: string = 'All';


  // =====================================================
  // STOCK HISTORY FILTERS
  // =====================================================

  selectedHistoryProduct: string = 'All';

  selectedHistoryType: string = 'All';


  // =====================================================
  // PRODUCTS
  // =====================================================

  products: InventoryProduct[] = [

    {
      id: 1,
      name: 'Wireless Headphone',
      category: 'Electronics',
      sku: 'WH-1001',
      stock: 35,
      lowStockLevel: 10,
      price: 2500,
      status: 'In Stock'
    },

    {
      id: 2,
      name: 'Smart Watch',
      category: 'Wearable',
      sku: 'SW-2001',
      stock: 18,
      lowStockLevel: 10,
      price: 4500,
      status: 'In Stock'
    },

    {
      id: 3,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      sku: 'BS-3001',
      stock: 8,
      lowStockLevel: 10,
      price: 3200,
      status: 'Low Stock'
    },

    {
      id: 4,
      name: 'Gaming Mouse',
      category: 'Computer',
      sku: 'GM-4001',
      stock: 0,
      lowStockLevel: 10,
      price: 1800,
      status: 'Out of Stock'
    },

    {
      id: 5,
      name: 'USB Keyboard',
      category: 'Computer',
      sku: 'KB-5001',
      stock: 7,
      lowStockLevel: 10,
      price: 1500,
      status: 'Low Stock'
    },

    {
      id: 6,
      name: 'Power Bank',
      category: 'Accessories',
      sku: 'PB-6001',
      stock: 3,
      lowStockLevel: 10,
      price: 2200,
      status: 'Low Stock'
    },

    {
      id: 7,
      name: 'Laptop Stand',
      category: 'Accessories',
      sku: 'LS-7001',
      stock: 12,
      lowStockLevel: 10,
      price: 1800,
      status: 'In Stock'
    }

  ];


  // =====================================================
  // STOCK HISTORY
  // =====================================================

  stockHistory: StockHistory[] = [

    {
      id: 1,
      productId: 1,
      productName: 'Wireless Headphone',
      sku: 'WH-1001',
      type: 'Stock In',
      quantity: 10,
      previousStock: 25,
      currentStock: 35,
      reason: 'Supplier restock',
      date: '19 Sep 2026, 10:30 AM'
    },

    {
      id: 2,
      productId: 3,
      productName: 'Bluetooth Speaker',
      sku: 'BS-3001',
      type: 'Stock Out',
      quantity: 4,
      previousStock: 12,
      currentStock: 8,
      reason: 'Customer order',
      date: '18 Sep 2026, 03:45 PM'
    },

    {
      id: 3,
      productId: 6,
      productName: 'Power Bank',
      sku: 'PB-6001',
      type: 'Stock Out',
      quantity: 5,
      previousStock: 8,
      currentStock: 3,
      reason: 'Customer order',
      date: '17 Sep 2026, 01:20 PM'
    },

    {
      id: 4,
      productId: 2,
      productName: 'Smart Watch',
      sku: 'SW-2001',
      type: 'Stock In',
      quantity: 8,
      previousStock: 10,
      currentStock: 18,
      reason: 'New stock received',
      date: '16 Sep 2026, 11:15 AM'
    }

  ];


  // =====================================================
  // INVENTORY CATEGORIES
  // =====================================================

  get categories(): string[] {

    return [
      'All',
      ...new Set(
        this.products.map(
          product => product.category
        )
      )
    ];

  }


  // =====================================================
  // FILTERED PRODUCTS
  // =====================================================

  get filteredProducts(): InventoryProduct[] {

    return this.products.filter(product => {

      const search =
        this.searchText
          .trim()
          .toLowerCase();


      const matchesSearch =
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        product.sku
          .toLowerCase()
          .includes(search);


      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;


      const matchesStatus =
        this.selectedStatus === 'All' ||
        product.status === this.selectedStatus;


      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );

    });

  }


  // =====================================================
  // INVENTORY SUMMARY
  // =====================================================

  get totalProducts(): number {

    return this.products.length;

  }


  get totalStock(): number {

    return this.products.reduce(
      (total, product) =>
        total + product.stock,
      0
    );

  }


  get lowStockProducts(): number {

    return this.products.filter(
      product =>
        product.status === 'Low Stock'
    ).length;

  }


  get outOfStockProducts(): number {

    return this.products.filter(
      product =>
        product.status === 'Out of Stock'
    ).length;

  }


  // =====================================================
  // STOCK PERCENTAGE
  // =====================================================

  getStockPercentage(
    product: InventoryProduct
  ): number {

    if (product.lowStockLevel <= 0) {

      return 100;

    }


    const percentage =
      (product.stock /
        (product.lowStockLevel * 5)) *
      100;


    return Math.min(
      percentage,
      100
    );

  }


  // =====================================================
  // UPDATE STOCK USING PROMPT
  // =====================================================

  updateStock(
    product: InventoryProduct
  ): void {

    const newStock = prompt(
      `Enter new stock for ${product.name}:`,
      product.stock.toString()
    );


    if (newStock === null) {

      return;

    }


    const stock = Number(newStock);


    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {

      alert(
        'Please enter a valid stock quantity.'
      );

      return;

    }


    const previousStock =
      product.stock;


    const stockChange =
      stock - previousStock;


    // No change
    if (stockChange === 0) {

      alert(
        'No stock change detected.'
      );

      return;

    }


    // Determine type
    const type:
      'Stock In' | 'Stock Out' =
      stockChange > 0
        ? 'Stock In'
        : 'Stock Out';


    const quantity =
      Math.abs(stockChange);


    // Update product
    product.stock = stock;


    // Update status
    this.updateProductStatus(
      product
    );


    // Add history
    this.addStockHistory(
      product,
      type,
      quantity,
      previousStock,
      stock,
      type === 'Stock In'
        ? 'Manual stock addition'
        : 'Manual stock adjustment'
    );


    alert(
      `Stock updated successfully.\n\n` +
      `Product: ${product.name}\n` +
      `Type: ${type}\n` +
      `Quantity: ${quantity}\n` +
      `Current Stock: ${stock}\n` +
      `Status: ${product.status}`
    );

  }


  // =====================================================
  // UPDATE PRODUCT STATUS
  // =====================================================

  updateProductStatus(
    product: InventoryProduct
  ): void {

    if (product.stock === 0) {

      product.status =
        'Out of Stock';

    } else if (
      product.stock <=
      product.lowStockLevel
    ) {

      product.status =
        'Low Stock';

    } else {

      product.status =
        'In Stock';

    }

  }


  // =====================================================
  // CLEAR INVENTORY FILTERS
  // =====================================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategory = 'All';

    this.selectedStatus = 'All';

  }


  // =====================================================
  // STOCK HISTORY PRODUCTS
  // =====================================================

  get historyProducts(): string[] {

    return [
      ...new Set(
        this.stockHistory.map(
          history =>
            history.productName
        )
      )
    ];

  }


  // =====================================================
  // FILTERED STOCK HISTORY
  // =====================================================

  get filteredStockHistory(): StockHistory[] {

    return this.stockHistory.filter(
      history => {

        const matchesProduct =
          this.selectedHistoryProduct === 'All' ||
          history.productName ===
          this.selectedHistoryProduct;


        const matchesType =
          this.selectedHistoryType === 'All' ||
          history.type ===
          this.selectedHistoryType;


        return (
          matchesProduct &&
          matchesType
        );

      }
    );

  }


  // =====================================================
  // CLEAR HISTORY FILTERS
  // =====================================================

  clearHistoryFilters(): void {

    this.selectedHistoryProduct =
      'All';

    this.selectedHistoryType =
      'All';

  }


  // =====================================================
  // ADD STOCK HISTORY
  // =====================================================

  addStockHistory(
    product: InventoryProduct,
    type: 'Stock In' | 'Stock Out',
    quantity: number,
    previousStock: number,
    currentStock: number,
    reason: string
  ): void {

    const history: StockHistory = {

      id: Date.now(),

      productId:
        product.id,

      productName:
        product.name,

      sku:
        product.sku,

      type:
        type,

      quantity:
        quantity,

      previousStock:
        previousStock,

      currentStock:
        currentStock,

      reason:
        reason,

      date:
        new Date().toLocaleString()

    };


    // Newest history first
    this.stockHistory.unshift(
      history
    );

  }


  // =====================================================
  // STOCK UPDATE MODAL
  // =====================================================

  showStockModal = false;

  selectedProduct:
    InventoryProduct | null = null;

  newStock:
    number | null = null;


  // =====================================================
  // OPEN STOCK MODAL
  // =====================================================

  openStockModal(
    product: InventoryProduct
  ): void {

    this.selectedProduct =
      product;

    this.newStock =
      product.stock;

    this.showStockModal =
      true;

  }


  // =====================================================
  // CLOSE STOCK MODAL
  // =====================================================

  closeStockModal(): void {

    this.showStockModal =
      false;

    this.selectedProduct =
      null;

    this.newStock =
      null;

  }


  // =====================================================
  // STOCK CHANGE
  // =====================================================

  get stockChange(): number {

    if (
      !this.selectedProduct ||
      this.newStock === null
    ) {

      return 0;

    }


    return (
      this.newStock -
      this.selectedProduct.stock
    );

  }


  // =====================================================
  // SAVE STOCK UPDATE
  // =====================================================

  saveStockUpdate(): void {

    if (
      !this.selectedProduct ||
      this.newStock === null
    ) {

      return;

    }


    // Validate
    if (
      !Number.isInteger(
        this.newStock
      ) ||
      this.newStock < 0
    ) {

      alert(
        'Please enter a valid stock quantity.'
      );

      return;

    }


    const product =
      this.selectedProduct;


    const previousStock =
      product.stock;


    const currentStock =
      this.newStock;


    const stockChange =
      currentStock -
      previousStock;


    // No change
    if (
      stockChange === 0
    ) {

      alert(
        'No stock change detected.'
      );

      return;

    }


    // Determine Stock In / Stock Out
    const type:
      'Stock In' | 'Stock Out' =
      stockChange > 0
        ? 'Stock In'
        : 'Stock Out';


    // Quantity should always be positive
    const quantity =
      Math.abs(stockChange);


    // Update product stock
    product.stock =
      currentStock;


    // Update product status
    this.updateProductStatus(
      product
    );


    // Create history
    this.addStockHistory(
      product,
      type,
      quantity,
      previousStock,
      currentStock,
      type === 'Stock In'
        ? 'Manual stock addition'
        : 'Manual stock adjustment'
    );


    // Success message
    alert(
      `Stock updated successfully!\n\n` +

      `Product: ${product.name}\n` +

      `Type: ${type}\n` +

      `Quantity: ${quantity}\n` +

      `Previous Stock: ${previousStock}\n` +

      `Current Stock: ${currentStock}\n` +

      `Status: ${product.status}`
    );


    // Close modal
    this.closeStockModal();

  }

}