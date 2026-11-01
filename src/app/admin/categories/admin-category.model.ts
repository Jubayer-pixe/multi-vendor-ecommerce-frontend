export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  active: boolean | null;
}

export interface CategoryRequest {
  id?: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  active: boolean;
}
