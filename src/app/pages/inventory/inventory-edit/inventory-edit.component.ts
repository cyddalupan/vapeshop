import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SetItem, updateItem } from '../store/inventory.action';
import { selectAllItems, selectCurrentItem } from '../store/inventory.selector';
import { map, take } from 'rxjs';
import { Item } from '../models';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent implements OnInit {
	items: Item[] = [];
	items$ = this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => !data.deleted_at))
	);

  public currentBarcode = 0;
  public itemId = 0;

	public inventoryForm = new FormGroup({
		code: new FormControl('', [Validators.required, this.validateBarcode.bind(this)]),
		name: new FormControl('', [Validators.required]),
		price: new FormControl('', [Validators.required]),
		stock: new FormControl('', [Validators.required]),
		desc: new FormControl(),
	});

  constructor(
    private route: ActivatedRoute,
		private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
		this.items$.pipe(take(1)).subscribe(items => {
			this.items = items;
		});

    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.itemId) {
      this.store.dispatch(SetItem(this.itemId));
      this.store.select(selectCurrentItem).pipe(take(1)).subscribe(item => {
        if (item) {
          this.currentBarcode = Number(item.code);
          this.inventoryForm.get("code")?.setValue(String(item.code));
          this.inventoryForm.get("name")?.setValue(String(item.name));
          this.inventoryForm.get("price")?.setValue(String(item.price));
          this.inventoryForm.get("stock")?.setValue(String(item.stock));
          this.inventoryForm.get("desc")?.setValue(String(item.desc));
        } 
      });
    }
  }

  public onSubmit() {
		const item:Item = {
			id: this.itemId,
			code: Number(this.inventoryForm.get('code')!.value),
			name: String(this.inventoryForm.get('name')!.value),
			price: Number(this.inventoryForm.get('price')!.value),
			stock: Number(this.inventoryForm.get('stock')!.value),
			desc: String(this.inventoryForm.get('desc')!.value),
			backup: true,
		};		
		this.store.dispatch(updateItem(item));	
		this.router.navigate(['/inventory']);
	}

	validateBarcode(control: any) {
    const barcode = control.value;
		const existingBarcodes = this.items.map(item => item.code).filter(code => code !== this.currentBarcode);
		if (existingBarcodes.includes(barcode)) {
      return { duplicateBarcode: true };
    }
    return null;
  }
}
