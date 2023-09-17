import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { AddItem }from '../store/inventory.action';
import { Item } from '../models';
import { map, take } from 'rxjs';
import { selectAllItems } from '../store/inventory.selector';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.css']
})
export class InventoryAddComponent implements OnInit {
	items: Item[] = [];
	items$ = this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => !data.deleted_at))
	);
	
	public inventoryForm = new FormGroup({
		code: new FormControl('', [Validators.required, this.validateBarcode.bind(this)]),
		name: new FormControl('', [Validators.required]),
		price: new FormControl('', [Validators.required]),
		desc: new FormControl(),
	});

	constructor(
		private store: Store,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.items$.pipe(take(1)).subscribe(items => {
			this.items = items;
		});
	}

	public onSubmit() {
		const item:Item = {
			id: Number(Date.now()),
			code: Number(this.inventoryForm.get('code')!.value),
			name: String(this.inventoryForm.get('name')!.value),
			price: Number(this.inventoryForm.get('price')!.value),
			desc: String(this.inventoryForm.get('desc')!.value),
		};		
		this.store.dispatch(AddItem(item));	
		this.router.navigate(['/inventory']);
	}

	validateBarcode(control: any) {
    const barcode = control.value;
		const existingBarcodes = this.items.map(item => item.code);
		if (existingBarcodes.includes(barcode)) {
      return { duplicateBarcode: true };
    }
    return null;
  }
}
