import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, debounceTime, delay, map, take, takeUntil, tap } from 'rxjs';

import { updateItem } from 'src/app/pages/inventory/store/inventory.action';
import { SetItem } from '../../inventory/store/inventory.action';
import { selectAllItems } from '../../inventory/store/inventory.selector';
import { selectCurrentReceipt } from '../store/receipt.selector';
import { Item } from '../../inventory/models';
import { selectAllOrders } from '../store/order.selector';
import { Order, Receipt } from '../models';
import { setOrder, setSelectedOrder } from '../store/order.actions';
import { initSetReceipt, setReceipt } from '../store/receipt.actions';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private inputSubject = new Subject<string>();

  totalReady = false;
  activeItem: Item | null = null;
  items: Item[] = [];
  receipt: Receipt|null = null;

  receipt$ = this.store.select(selectCurrentReceipt);

  orders$ = combineLatest([this.store.select(selectAllOrders),this.receipt$]).pipe(
    map(([order, receipt]) => {
      if (receipt)
        this.receipt = receipt;
      return order.filter(data => (
        !data.deleted_at && receipt && 
        receipt.id === data.receipt
      ))
    })
	);

	items$ = this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => !data.deleted_at))
	);

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

  ngOnInit() {
    this.totalCost$.pipe(
      take(1),
    ).subscribe(total => {
      this.totalReady = true;

      if (this.receipt)
        this.store.dispatch(initSetReceipt({ receipt: {
          ...this.receipt,
          total: total
        }}));
    });
  }

  ngAfterViewInit() {
    // Set focus on the input element after the view has been initialized
    this.setFocusOnInput();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
			const deletedItem = this.items.filter(item => item.id === order.item)[0];

			this.store.dispatch(setSelectedOrder({id: order.id}));
			this.store.dispatch(setOrder({order: {
				...order,
				backup: false,
				deleted_at: formattedDate,
			}}));

			this.store.dispatch(updateItem({
				...deletedItem,
				stock: deletedItem.stock + order.quantity,
				backup: false,
			}));	
		}
	}

  print() {
    window.print();
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
