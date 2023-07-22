import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentItem } from '../../inventory/store/inventory.selector';
import { take } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  public itemName = "";
  constructor(
    private store: Store
  ) { }

    ngOnInit(): void {
      this.store.select(selectCurrentItem).pipe(take(1)).subscribe(item => {
        if (item)
          this.itemName = item.name;
      });
    }

}
