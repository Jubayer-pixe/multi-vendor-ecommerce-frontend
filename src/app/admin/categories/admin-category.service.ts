import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { AdminCategory, CategoryRequest } from './admin-category.model';

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {
  private readonly categoriesUrl = `${API_BASE_URL}/categories`;

  constructor(private http: HttpClient) {}

  list(): Observable<AdminCategory[]> { return this.http.get<AdminCategory[]>(this.categoriesUrl); }
  create(request: CategoryRequest): Observable<AdminCategory> { return this.http.post<AdminCategory>(this.categoriesUrl, request); }
  update(id: number, request: CategoryRequest): Observable<AdminCategory> { return this.http.put<AdminCategory>(`${this.categoriesUrl}/${id}`, { ...request, id }); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.categoriesUrl}/${id}`); }
}
