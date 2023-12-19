import { Component } from '@angular/core';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.css']
})
export class ExtraComponent {
  localprint = "";

  ngOnInit(): void {
    const local = JSON.parse(String(localStorage.getItem('app')));
    this.localprint = local;
  }
}
