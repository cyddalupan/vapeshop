import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, map, take, takeUntil } from 'rxjs';
import { SetItem } from '../../inventory/store/inventory.action';
import { selectAllItems, selectCurrentItem } from '../../inventory/store/inventory.selector';
import { selectCurrentReceipt } from '../store/receipt.selector';
import { Item } from '../../inventory/models';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  private inputSubject = new Subject<string>();

  activeItem: Item | null = null;

	items$ = this.store.select(selectAllItems).pipe(
		map(item => item.filter(data => !data.deleted_at))
	);

  receipt$ = this.store.select(selectCurrentReceipt);

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
