import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    // Set focus on the input element after the view has been initialized
    this.setFocusOnInput();
  }
  
  onBarcodeScanned(event: KeyboardEvent) {
    const scannedData = (event.target as HTMLInputElement).value;
    // Process the scanned barcode data here
    console.log('Scanned data:', scannedData);
    
    this.router.navigateByUrl('/item/222');
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
