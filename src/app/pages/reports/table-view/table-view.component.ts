import { Component, Input } from '@angular/core';

import { Receipt, Order } from '../../pos/models';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent {
 @Input() receipts: Receipt[] = [];
 @Input() orders: Order[] = [];

 filterOrder(receiptId: number) {
	 return this.orders.filter(order => order.receipt === receiptId);
 }
}
