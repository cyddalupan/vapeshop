import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentItem } from '../../../inventory/store/inventory.selector';
import { take } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit {

  public itemName = "";
	public price = 0;

  constructor(
    private store: Store,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.store.select(selectCurrentItem).pipe(take(1)).subscribe(item => {
      if (item) {
        this.itemName = item.name;
        this.price = item.price;
      }
    });
  }

  ngAfterViewInit() {
    // Set focus on the input element after the view has been initialized
    this.setFocusOnInput();
  }

  onSubmit() {
    console.log("SUBMIT")
  }

  private setFocusOnInput() {
    console.log("focus mode");
    // Find the input element by its selector (modify this selector according to your HTML structure)
    const inputElement = this.elementRef.nativeElement.querySelector('#quantity');

    // Check if the input element exists and is focusable
    if (inputElement && inputElement.focus) {
      // Use Renderer2 to set focus on the input element
    console.log("focus done");
      this.renderer.selectRootElement(inputElement).focus();
    }
  }

}
