import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentItem } from '../../../inventory/store/inventory.selector';
import { take } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Order, Receipt } from '../../models';
import { selectCurrentReceipt } from '../../store/receipt.selector';
import { Item } from 'src/app/pages/inventory/models';
import { addOrder } from '../../store/order.actions';
import { Router } from '@angular/router';
import { updateItem } from 'src/app/pages/inventory/store/inventory.action';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit {
  public orderForm: FormGroup  = new FormGroup({
		price: new FormControl(0, [Validators.required]),
		quantity: new FormControl(null, [Validators.required]),
	});

  public receipt = {} as Receipt;
  public item = {} as Item;

  constructor(
    private router: Router,
    private store: Store,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.store.select(selectCurrentReceipt).pipe(take(1)).subscribe(receipt => {
      if (receipt)
        this.receipt = receipt;
    });
    this.store.select(selectCurrentItem).pipe(take(1)).subscribe(item => {
      if (item) {
        this.item = item;
        this.orderForm.get("price")?.setValue(this.item.price);
      }
    });
  }

  ngAfterViewInit() {
    // Set focus on the input element after the view has been initialized
    this.setFocusOnInput();
  }

  onSubmit() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const quantity = Number(this.orderForm.get('quantity')!.value);

    const currentId = Number(Date.now());
		const order: Order = {
			id: currentId,
      receipt: this.receipt.id,
      item: this.item.id,
      quantity: quantity,
      price: Number(this.orderForm.get('price')!.value),
      backup: false,
      updated_at: formattedDate,
      deleted_at: null,
		};
		this.store.dispatch(addOrder({ order: order }));
    
		this.store.dispatch(updateItem({
			...this.item,
			stock: this.item.stock - quantity,
			backup: false,
		}));	
		this.router.navigate(['/receipt']);
  }

  private setFocusOnInput() {
    // Find the input element by its selector (modify this selector according to your HTML structure)
    const inputElement = this.elementRef.nativeElement.querySelector('#quantity');

    // Check if the input element exists and is focusable
    if (inputElement && inputElement.focus) {
      // Use Renderer2 to set focus on the input element
      this.renderer.selectRootElement(inputElement).focus();
    }
  }

}
