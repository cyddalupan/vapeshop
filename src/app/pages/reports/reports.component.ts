import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';


import { SelectCount } from '../../store/app.selector';
import { ReceiptService } from '../../service/receipt.service';
import { OrderService } from '../../service/order.service';
import { Receipt } from '../pos/models';
import { Order } from '../pos/models';
import { selectAllItems } from '../inventory/store/inventory.selector';
import { Item } from '../inventory/models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  isOnline = navigator.onLine;
  formattedDate = new Date().toISOString().substr(0, 10);
	receipts: Receipt[] = [];
	orders: Order[] = [];
	items: Item[] = [];
	
	unSyncTotal$ = this.store.select(SelectCount);

  public reportForm: FormGroup = new FormGroup({
		startdate: new FormControl(this.formattedDate, [Validators.required]),
		enddate: new FormControl(this.formattedDate, [Validators.required]),
  });

  constructor(
    private store: Store,
		private receiptService: ReceiptService,
		private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

		this.store.select(selectAllItems).pipe(take(1)).subscribe(items => {
			this.items = items;
		});
  }

	available(unsync: number | null) {
		return (unsync === 0 && this.isOnline);
	}

  onSubmit() {
		let startdate = this.reportForm.get('startdate')?.value;
		let enddate = this.reportForm.get('enddate')?.value;
		if (startdate && enddate) {
			startdate = new Date(startdate).setHours(0, 0, 0, 0);
			enddate = new Date(enddate).setHours(0, 0, 0, 0);
			console.log('startdate', startdate);
			console.log('enddate', enddate);

			this.receiptService.getAllReceipt().subscribe(receipts => {
				this.receipts = receipts.filter(receipt => (
					(new Date(receipt.updated_at).setHours(0, 0, 0, 0) >= startdate)) &&
					(new Date(receipt.updated_at).setHours(0, 0, 0, 0) <= enddate)
				);
			});

			this.orderService.getAllOrder().subscribe(orders => {
				this.orders = orders.filter(orders => (
					(new Date(orders.updated_at).setHours(0, 0, 0, 0) >= startdate)) &&
					(new Date(orders.updated_at).setHours(0, 0, 0, 0) <= enddate)
				);
			});
		}
  }
}
