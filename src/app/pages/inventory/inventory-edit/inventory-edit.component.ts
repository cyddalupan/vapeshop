import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SetItem, updateItem } from '../store/inventory.action';
import { selectCurrentItem } from '../store/inventory.selector';
import { take } from 'rxjs';
import { Item } from '../model/store.model';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent implements OnInit {

  public itemId = 0;

	public inventoryForm = new FormGroup({
		code: new FormControl('', [Validators.required]),
		name: new FormControl('', [Validators.required]),
		price: new FormControl('', [Validators.required]),
		desc: new FormControl(),
	});

  constructor(
    private route: ActivatedRoute,
		private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.itemId) {
      this.store.dispatch(SetItem(this.itemId));
      this.store.select(selectCurrentItem).pipe(take(1)).subscribe(item => {
        if (item) {
          this.inventoryForm.get("code")?.setValue(String(item.code));
          this.inventoryForm.get("name")?.setValue(String(item.name));
          this.inventoryForm.get("price")?.setValue(String(item.price));
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
			desc: String(this.inventoryForm.get('desc')!.value),
			backup: false,
		};		
		this.store.dispatch(updateItem(item));	
		this.router.navigate(['/inventory']);
	}

}
