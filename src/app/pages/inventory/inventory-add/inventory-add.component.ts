import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { AddItem }from '../store/inventory.action';
import { Item } from '../models';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.css']
})
export class InventoryAddComponent {
	public inventoryForm = new FormGroup({
		code: new FormControl('', [Validators.required]),
		name: new FormControl('', [Validators.required]),
		price: new FormControl('', [Validators.required]),
		desc: new FormControl(),
	});

	constructor(
		private store: Store,
		private router: Router,
	) {}

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
}
