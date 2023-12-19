import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Receipt } from './models';
import { loadAddReceipt } from './store/receipt.actions';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  public selectedDate: Date | undefined;
  public receiptForm:FormGroup = new FormGroup({});

	constructor(
		private store: Store,
		private router: Router,
    private datePipe: DatePipe,
	) {}

  ngOnInit() {
    this.selectedDate = new Date();

    this.receiptForm = new FormGroup({
      customer: new FormControl(
        this.datePipe.transform(
          this.selectedDate, 'yyyy-MM-dd HH:mm:ss'
          ),
          [Validators.required]
      ),
    });
  }
  
  onSubmit() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const currentId = Number(Date.now());
		const receipt: Receipt = {
			id: currentId,
			customer: String(this.receiptForm.get('customer')!.value),
      total: 0,
      backup: false,
      updated_at: formattedDate,
      deleted_at: null,
		};
		this.store.dispatch(loadAddReceipt({ receipt: receipt }));
		this.router.navigate(['/receipt']);
  }
}
