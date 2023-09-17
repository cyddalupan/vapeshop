import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { SelectCount } from './store/app.selector';
import { InitializeItem } from './pages/inventory/store/inventory.action';
import { InventoryService } from './service/inventory.service';
import { selectAllItems } from './pages/inventory/store/inventory.selector';
import { selectAllReceipts } from './pages/pos/store/receipt.selector';
import { selectAllOrders } from './pages/pos/store/order.selector';
import { InitializeReceipt, deleteReceipt } from './pages/pos/store/receipt.actions';
import { InitializeOrder } from './pages/pos/store/order.actions';
import { UpdateSyncCount } from './store/app.action';
import { Order, Receipt } from './pages/pos/models';

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

	unSyncTotal$ = this.store.select(SelectCount);

  unsyncItem$ = this.store.select(selectAllItems).pipe(
    map(items => (items.filter(item => item.backup !== true)))
  );

  unsyncReceipts: Receipt[] = [];
  unsyncReceipt$ = this.store.select(selectAllReceipts).pipe(
    map(receipts => (receipts.filter(receipt => receipt.backup !== true)))
  );

  unsyncOrders: Order[] = [];
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
		if (local?.inventory)
			this.store.dispatch(InitializeItem(local.inventory));
    if (local?.receipts)
      this.store.dispatch(InitializeReceipt(local.receipts));
    if (local?.orders)
      this.store.dispatch(InitializeOrder(local.orders));

    this.userService.getLoginStatus().pipe(take(1)).subscribe(data => {
      if (!data) {
        this.userService.login().pipe(take(1)).subscribe(logdata => {
          localStorage.setItem('token', logdata.token);
        });
      } else {
        console.log("correct login",data);
      }
    });

    this.unsyncItem$.subscribe(data => {
      this.unsyncItemCount = data.length;
			this.updateUnsyncCount();
    });

    this.unsyncReceipt$.subscribe(data => {
      this.unsyncReceiptCount = data.length;
			this.updateUnsyncCount();
      this.unsyncReceipts = data;
    });

    this.unsyncOrders$.subscribe(data => {
      this.unsyncOrderCount = data.length;
			this.updateUnsyncCount();
      this.unsyncOrders = data;
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

	getSyncColor(unsync: number | null) {
		let count = 0;
		if (unsync)
			count = unsync;
		if (count <= 10)
			return 'btn-primary';
		if ((count > 10) && (count <= 99))
			return  'btn-warning';
		return 'btn-danger';
	}

	updateUnsyncCount() {
		const total =  this.unsyncItemCount+
      this.unsyncReceiptCount+
      this.unsyncOrderCount;

		this.store.dispatch(UpdateSyncCount({count: total}));
	}

  logout() {
    this.userService.logout().pipe(take(1)).subscribe(data => {
      console.log("logout data", data);
    });
  }

  backup() {
    // Delete all receipt with no orders
    const ordersReceiptsIds = this.unsyncOrders.map(order => order.receipt);
    this.unsyncReceipts.map(receipt => {
      if (!ordersReceiptsIds.includes(receipt.id)) {
        this.store.dispatch(deleteReceipt({ id: receipt.id }));	
      }
    });

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
