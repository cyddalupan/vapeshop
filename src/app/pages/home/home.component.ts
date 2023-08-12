import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AddItem } from '../inventory/store/inventory.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    // this.store.dispatch(AddItem({
    //   id: 111,
    //   code: 4800488959878,
    //   name: 'Nursy Wet Wipes',
    //   price: 133,
		// 	desc: "random desc",
    //   created_at: '2012',
    //   updated_at: '2013',
    //   deleted_at: null
    // }));

    // this.store.dispatch(AddItem({
    //   id: 222,
    //   code: 16000439894,
    //   name: 'Granola Bar',
    //   price: 321,
		// 	desc: "another desc",
    //   created_at: '2012',
    //   updated_at: '2013',
    //   deleted_at: null
    // }));
  }
  
}
