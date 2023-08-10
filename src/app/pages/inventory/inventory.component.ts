import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectAllItems, selectItemTotal } from './store/inventory.selector';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
	items$ =  this.store.select(selectAllItems);

	constructor(
		private store:Store
	) { }
}
