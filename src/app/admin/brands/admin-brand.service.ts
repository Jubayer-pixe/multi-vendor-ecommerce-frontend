import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';

export interface AdminBrand { id: number; name: string; logoUrl: string | null; description: string | null; }
export type BrandRequest = Omit<AdminBrand, 'id'> & { id?: number };

@Injectable({ providedIn: 'root' })
export class AdminBrandService {
  private readonly url = `${API_BASE_URL}/brands`;
  constructor(private http: HttpClient) {}
  list(): Observable<AdminBrand[]> { return this.http.get<AdminBrand[]>(this.url); }
  create(request: BrandRequest): Observable<AdminBrand> { return this.http.post<AdminBrand>(this.url, request); }
  update(id: number, request: BrandRequest): Observable<AdminBrand> { return this.http.put<AdminBrand>(`${this.url}/${id}`, { ...request, id }); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
