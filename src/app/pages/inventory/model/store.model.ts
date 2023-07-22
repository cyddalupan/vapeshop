export interface Item {
  id: number;
  code: number;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string|null;
}