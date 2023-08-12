import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { updateItem } from './store/inventory.action';
import { selectAllItems } from './store/inventory.selector';
import { Item } from './model/store.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
	items$ =  this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => !data.deleted_at))
	);

	constructor(
		private store:Store
	) { }

	deleteItem(item: Item) {
		if (confirm('Are you sure you want to delete?')) {
      this.store.dispatch(updateItem({
				...item,
				backup: false,
				deleted_at: String(Date.now()),
			}))
    }
	}
}
