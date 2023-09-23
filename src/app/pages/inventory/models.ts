export interface Item {
  id: number;
	code: number;
  name: string;
  price: number;
	desc: string;
  stock: number;
	backup?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string|null;
}
