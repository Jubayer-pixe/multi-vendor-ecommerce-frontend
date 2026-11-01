import { Category } from '../models/category.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { CategoryOptionDto } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryOptionDto[]>(`${API_BASE_URL}/categories`).pipe(
      map(categories => categories.filter(category => category.active !== false).map(category => ({
        id: category.id,
        name: category.name,
        icon: 'bi-tags',
        image: category.imageUrl || 'assets/images/home.jpg',
        productCount: 0
      })))
    );
  }
}
