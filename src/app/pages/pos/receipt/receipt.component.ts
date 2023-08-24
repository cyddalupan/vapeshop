import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, debounceTime, map, take, takeUntil } from 'rxjs';
import { SetItem } from '../../inventory/store/inventory.action';
import { selectAllItems } from '../../inventory/store/inventory.selector';
import { selectCurrentReceipt } from '../store/receipt.selector';
import { Item } from '../../inventory/models';
import { selectAllOrders } from '../store/order.selector';
import { setReceipt } from '../store/receipt.actions';
import { Order } from '../models';
import { setOrder, setSelectedOrder, updateOrder } from '../store/order.actions';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  private inputSubject = new Subject<string>();

  activeItem: Item | null = null;
  items: Item[] = [];

  orders$ = this.store.select(selectAllOrders).pipe(
		map(order => order.filter(data => !data.deleted_at))
	);

	items$ = this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => !data.deleted_at))
	);

  receipt$ = this.store.select(selectCurrentReceipt);

  totalCost$ = this.orders$.pipe(
    map(orders => {
      return orders
        .map(order => (order?.price * order?.quantity))
        .reduce((accumulator, currentValue) => 
          accumulator + currentValue, 0);
    })
  );

  public detectedItem = '';

  constructor(
    private router: Router,
    private store: Store,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.inputSubject.pipe(takeUntil(this.unsubscribe$), debounceTime(900)).subscribe(value => {
      if (this.activeItem) {
        this.store.dispatch(SetItem(this.activeItem.id));
        this.router.navigateByUrl('/item');
      }
    });

    this.items$.pipe(take(1)).subscribe(items => {
      this.items = items;
    });
  }

  ngAfterViewInit() {
    // Set focus on the input element after the view has been initialized
    this.setFocusOnInput();
  }
  
  onBarcodeScanned(event: KeyboardEvent) {
    const barcode = (event.target as HTMLInputElement).value;
    this.inputSubject.next(barcode);

    this.items$.pipe(takeUntil(this.unsubscribe$), take(1)).subscribe(items => {
      const match = items.filter(item => item.code === Number(barcode));

      if (match.length > 0) {
        this.activeItem = match[0];
        this.detectedItem = match[0].name;
      } else {
        this.activeItem = null;
        this.detectedItem = 'Item does not exist';
      }
    });
  }

  itemNameById(id: number) {
    const matchId = this.items.filter(item => item.id === id);
    if (matchId) {
      return matchId[0].name;
    }
    return "Item not found";
  }

  deleteOrder(order: Order) {
		if (confirm('Are you sure you want to order?')) {
			const currentDate = new Date();
			const formattedDate = currentDate.toISOString().split('T')[0];

      this.store.dispatch(setSelectedOrder({id: order.id}));
      this.store.dispatch(setOrder({order: {
				...order,
				backup: false,
				deleted_at: formattedDate,
			}}))
    }
	}
  
  private setFocusOnInput() {
    // Find the input element by its selector (modify this selector according to your HTML structure)
    const inputElement = this.elementRef.nativeElement.querySelector('#barcode');

    // Check if the input element exists and is focusable
    if (inputElement && inputElement.focus) {
      // Use Renderer2 to set focus on the input element
      this.renderer.selectRootElement(inputElement).focus();
    }
  }
}
