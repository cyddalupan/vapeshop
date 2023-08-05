import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.css']
})
export class InventoryAddComponent {
	public inventoryForm = new FormGroup({
		code: new FormControl(),
		name: new FormControl(),
		price: new FormControl(),
		desc: new FormControl(),
	});
