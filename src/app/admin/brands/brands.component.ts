import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminBrand, AdminBrandService, BrandRequest } from './admin-brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  brands: AdminBrand[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  editId: number | null = null;
  pendingDeleteId: number | null = null;
  form: BrandRequest = this.emptyForm();
  constructor(private brandService: AdminBrandService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.brandService.list().subscribe({
      next: (brands) => { this.brands = brands; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = this.messageFor(error, 'Unable to load brands.'); },
    });
  }

  get filteredBrands(): AdminBrand[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.brands.filter((brand) => !query || `${brand.name} ${brand.description ?? ''}`.toLowerCase().includes(query));
  }

  edit(brand: AdminBrand): void { this.editId = brand.id; this.form = { name: brand.name, logoUrl: brand.logoUrl, description: brand.description }; }
  reset(): void { this.editId = null; this.form = this.emptyForm(); }

  save(): void {
    if (!this.form.name.trim()) { this.errorMessage = 'Brand name is required.'; return; }
    const request = { ...this.form, name: this.form.name.trim(), logoUrl: this.form.logoUrl?.trim() || null, description: this.form.description?.trim() || null };
    this.saving = true;
    this.errorMessage = '';
    const operation = this.editId === null ? this.brandService.create(request) : this.brandService.update(this.editId, request);
    operation.subscribe({
      next: (brand) => { this.brands = this.editId === null ? [brand, ...this.brands] : this.brands.map((item) => item.id === brand.id ? brand : item); this.saving = false; this.successMessage = this.editId === null ? 'Brand created.' : 'Brand updated.'; this.reset(); },
      error: (error) => { this.saving = false; this.errorMessage = this.messageFor(error, 'Unable to save brand.'); },
    });
  }

  delete(brand: AdminBrand): void {
    if (this.pendingDeleteId !== brand.id) { this.pendingDeleteId = brand.id; return; }
    this.brandService.delete(brand.id).subscribe({
      next: () => { this.brands = this.brands.filter((item) => item.id !== brand.id); this.pendingDeleteId = null; this.successMessage = 'Brand deleted.'; },
      error: (error) => { this.pendingDeleteId = null; this.errorMessage = this.messageFor(error, 'Unable to delete this brand. It may still be referenced by products.'); },
    });
  }

  private emptyForm(): BrandRequest { return { name: '', logoUrl: null, description: null }; }
  private messageFor(error: any, fallback: string): string { if (error.status === 401 || error.status === 403) return 'Administrator access is required for this action.'; return error.error?.message || fallback; }
}
