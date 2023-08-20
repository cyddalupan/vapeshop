import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentItem } from '../../../inventory/store/inventory.selector';
import { take } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit {
  public orderForm: FormGroup  = new FormGroup({
		price: new FormControl(0, [Validators.required]),
		quantity: new FormControl(1, [Validators.required]),
	});

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
        this.orderForm.get("price")?.setValue(this.price);
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
    // Find the input element by its selector (modify this selector according to your HTML structure)
    const inputElement = this.elementRef.nativeElement.querySelector('#quantity');

    // Check if the input element exists and is focusable
    if (inputElement && inputElement.focus) {
      // Use Renderer2 to set focus on the input element
      this.renderer.selectRootElement(inputElement).focus();
    }
  }

}
