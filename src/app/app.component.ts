import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vapeshop';

  update(){
    localStorage.setItem('myKey', 'myValue');
  }

  get lowkal() {
    return  localStorage.getItem('myKey');
  }
}
