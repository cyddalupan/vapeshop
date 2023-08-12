import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AddItem, SetItem } from '../inventory/store/inventory.action';
import { selectCurrentItem } from '../inventory/store/inventory.selector';
import { pipe, take } from 'rxjs';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements AfterViewInit {

  public detectedItem = '';

  constructor(
    private router: Router,
    private store: Store,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    // Set focus on the input element after the view has been initialized
    this.setFocusOnInput();

    this.store.dispatch(AddItem({
      id: 111,
      code: 4800488959878,
      name: 'Nursy Wet Wipes',
      price: 133,
			desc: "random desc",
      created_at: '2012',
      updated_at: '2013',
      deleted_at: null
    }));

    this.store.dispatch(AddItem({
      id: 222,
      code: 16000439894,
      name: 'Granola Bar',
      price: 321,
			desc: "another desc",
      created_at: '2012',
      updated_at: '2013',
      deleted_at: null
    }));
  }
  
  onBarcodeScanned(event: KeyboardEvent) {
    const scannedData = Number((event.target as HTMLInputElement).value);

    this.store.dispatch(SetItem(scannedData));
    this.store.select(selectCurrentItem).pipe(take(1)).subscribe(item => {
      if (item) {
        this.detectedItem = item.name;
        setTimeout(() => {
          this.router.navigateByUrl('/item');
        }, 500);
       } 
      else
        this.detectedItem = 'Item does not exist';
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
