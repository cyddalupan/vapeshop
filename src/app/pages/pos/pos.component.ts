import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AddItem, SetItem } from '../inventory/store/inventory.action';
import { selectCurrentItem } from '../inventory/store/inventory.selector';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements AfterViewInit {

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
      id: 4800488959878,
      name: 'Nursy',
      price: 133,
      created_at: '2012',
      updated_at: '2013',
      deleted_at: null
    }));

    this.store.dispatch(AddItem({
      id: 16000439894,
      name: 'two',
      price: 321,
      created_at: '2012',
      updated_at: '2013',
      deleted_at: null
    }));
  }
  
  onBarcodeScanned(event: KeyboardEvent) {
    const scannedData = (event.target as HTMLInputElement).value;
    // Process the scanned barcode data here
    console.log('Scanned data:', scannedData);
    
    //this.router.navigateByUrl('/item/222');


    //this.store.dispatch(SetItem("4800488959878"));
    this.store.dispatch(SetItem("160004398"));
    this.store.select(selectCurrentItem).subscribe(data => {
      console.log("data",data);
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
