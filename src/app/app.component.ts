import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { InitializeItem } from './pages/inventory/store/inventory.action';
import { InventoryService } from './service/inventory.service';
import { selectAllItems } from './pages/inventory/store/inventory.selector';
import { selectAllReceipts } from './pages/pos/store/receipt.selector';
import { selectAllOrders } from './pages/pos/store/order.selector';
import { InitializeReceipt } from './pages/pos/store/receipt.actions';
import { InitializeOrder } from './pages/pos/store/order.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'vapeshop';
  isOnline = navigator.onLine;

  unsyncItemCount = 0;
  unsyncReceiptCount = 0;
  unsyncOrderCount = 0;

  unsyncItem$ = this.store.select(selectAllItems).pipe(
    map(items => (items.filter(item => item.backup !== true)))
  );

  unsyncReceipt$ = this.store.select(selectAllReceipts).pipe(
    map(receipts => (receipts.filter(receipt => receipt.backup !== true)))
  );

  unsyncOrders$ = this.store.select(selectAllOrders).pipe(
    map(orders => (orders.filter(order => order.backup !== true)))
  );

  constructor(
    private store: Store,
    private userService: UserService,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit(): void {
    const local = JSON.parse(String(localStorage.getItem('app')));
    console.log("local",local);
		if (local?.inventory)
			this.store.dispatch(InitializeItem(local.inventory));
    if (local?.receipts)
      this.store.dispatch(InitializeReceipt(local.receipts));
    if (local?.orders)
      this.store.dispatch(InitializeOrder(local.orders));

    this.userService.getLoginStatus().pipe(take(1)).subscribe(data => {
      console.log("check login stat");
      console.log("check data",data);
      if (!data) {
        console.log("error login");
        this.userService.login().pipe(take(1)).subscribe(logdata => {
          console.log("done log data");
          console.log("token", logdata.token);

          localStorage.setItem('token', logdata.token);
        });
      } else {
        console.log("correct login");
        console.log("login data",data);
      }
    });

    this.unsyncItem$.subscribe(data => {
      this.unsyncItemCount = data.length;
    });

    this.unsyncReceipt$.subscribe(data => {
      console.log('receipt count:',data.length);
      this.unsyncReceiptCount = data.length;
    });

    this.unsyncOrders$.subscribe(data => {
      console.log('order count:',data.length);
      this.unsyncOrderCount = data.length;
    });

    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  ngAfterViewInit(): void {
    this.store.subscribe(state => {
      this.saveStateToLocalStorage(state);
    });
  }

  get unsyncCount() {
    return this.unsyncItemCount+
      this.unsyncReceiptCount+
      this.unsyncOrderCount;
  }

  logout() {
    this.userService.logout().pipe(take(1)).subscribe(data => {
      console.log("after logout");
      console.log("logout data", data);
    });
  }

  backup() {
    this.inventoryService.cloudbackup();
  }

  private saveStateToLocalStorage(state: any): void {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('app', serializedState);
    } catch (err) {
      console.error('Error saving state to local storage:', err);
    }
  }
}
