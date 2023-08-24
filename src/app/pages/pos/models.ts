export interface Receipt {
  id: number;
  customer: string;
  total: number;
	backup: boolean;
}

export interface Order {
  id: number;
  receipt_id: number;
  item_id: number;
  quantity: number;
  price: number;
	backup: boolean;
}