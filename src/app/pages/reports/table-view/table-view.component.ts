import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Receipt, Order } from '../../pos/models';
import { Item } from '../../inventory/models';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent {
 @Input() receipts: Receipt[] = [];
 @Input() orders: Order[] = [];
 @Input() items: Item[] = [];

 @Output() generateCSV: EventEmitter<void> = new EventEmitter<void>();

  filterOrder(receiptId: number) {
    return this.orders.filter(order => order.receipt === receiptId);
  }

	itemName(itemId: number) {
		return this.items.filter(item => item.id === itemId)?.[0]?.name;
	}

  print() {
    window.print();
  }
}
