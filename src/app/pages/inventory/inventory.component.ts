import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { updateItem } from './store/inventory.action';
import { selectAllItems } from './store/inventory.selector';
import { Item } from './models';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
	items$ = this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => data && !data.deleted_at))
	);

	constructor(
		private store:Store
	) { }

	deleteItem(item: Item) {
		if (confirm('Are you sure you want to delete?')) {
			const currentDate = new Date();
			const formattedDate = currentDate.toISOString().split('T')[0];

      this.store.dispatch(updateItem({
				...item,
				backup: true,
				deleted_at: formattedDate,
			}))
    }
	}
}
