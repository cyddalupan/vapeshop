import { Component } from '@angular/core';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent {
  onBarcodeScanned(event: KeyboardEvent) {
    const scannedData = (event.target as HTMLInputElement).value;
    // Process the scanned barcode data here
    console.log('Scanned data:', scannedData);
  }
}
