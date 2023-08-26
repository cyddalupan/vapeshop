import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  formattedDate = new Date().toISOString().substr(0, 10);

  public reportForm: FormGroup = new FormGroup({
		startdate: new FormControl(this.formattedDate, [Validators.required]),
		enddate: new FormControl(this.formattedDate, [Validators.required]),
  });

  onSubmit() {
    console.log("submit trigger");
  }
}
