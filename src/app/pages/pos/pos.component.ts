import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  public selectedDate: Date | undefined;
  public receiptForm:FormGroup = new FormGroup({});

  constructor(private datePipe: DatePipe) {}

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
    console.log("submit");
  }
}
