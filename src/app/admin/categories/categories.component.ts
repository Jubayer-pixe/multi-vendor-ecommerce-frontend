import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminCategory, CategoryRequest } from './admin-category.model';
import { AdminCategoryService } from './admin-category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: AdminCategory[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  editId: number | null = null;
  pendingDeleteId: number | null = null;
  form: CategoryRequest = this.emptyForm();

  constructor(private categoryService: AdminCategoryService) {}

  ngOnInit(): void { this.loadCategories(); }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';
    this.categoryService.list().subscribe({
      next: (categories) => { this.categories = categories; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = this.messageFor(error, 'Unable to load categories.'); },
    });
  }

  get filteredCategories(): AdminCategory[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.categories.filter((category) => !query || `${category.name} ${category.slug}`.toLowerCase().includes(query));
  }

  edit(category: AdminCategory): void {
    this.editId = category.id;
    this.form = { id: category.id, name: category.name, slug: category.slug, imageUrl: category.imageUrl, active: category.active ?? true };
    this.pendingDeleteId = null;
  }

  resetForm(): void { this.editId = null; this.form = this.emptyForm(); this.errorMessage = ''; }

  generateSlug(): void {
    this.form.slug = this.slugify(this.form.name);
  }

  save(): void {
    const name = this.form.name.trim();
    const slug = this.form.slug.trim();
    if (!name || !slug) { this.errorMessage = 'Category name and slug are required.'; return; }
    const request = { ...this.form, id: this.editId ?? undefined, name, slug, imageUrl: this.form.imageUrl?.trim() || null };
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const operation = this.editId === null
      ? this.categoryService.create(request)
      : this.categoryService.update(this.editId, request);
    operation.subscribe({
      next: (category) => {
        this.categories = this.editId === null
          ? [category, ...this.categories]
          : this.categories.map((item) => item.id === category.id ? category : item);
        this.saving = false;
        this.successMessage = this.editId === null ? 'Category created.' : 'Category updated.';
        this.resetForm();
      },
      error: (error) => { this.saving = false; this.errorMessage = this.messageFor(error, 'Unable to save the category.'); },
    });
  }

  confirmDelete(category: AdminCategory): void {
    if (this.pendingDeleteId !== category.id) { this.pendingDeleteId = category.id; return; }
    this.categoryService.delete(category.id).subscribe({
      next: () => { this.categories = this.categories.filter((item) => item.id !== category.id); this.pendingDeleteId = null; this.successMessage = 'Category deleted.'; },
      error: (error) => { this.pendingDeleteId = null; this.errorMessage = this.messageFor(error, 'Unable to delete this category. It may still be referenced by products.'); },
    });
  }

  private emptyForm(): CategoryRequest { return { name: '', slug: '', imageUrl: null, active: true }; }
  private slugify(value: string): string { return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private messageFor(error: any, fallback: string): string {
    if (error.status === 401 || error.status === 403) return 'Administrator access is required for this action.';
    return error.error?.message || error.error?.detail || fallback;
  }
}
