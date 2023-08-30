import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environment/environment';
import { Item } from '../pages/inventory/models';
import { Observable, catchError, map, take, throwError } from 'rxjs';
import { selectAllItems } from '../pages/inventory/store/inventory.selector';
import { AddItem, deleteItem } from '../pages/inventory/store/inventory.action';
import { ReceiptService } from './receipt.service';
import { selectAllOrders } from '../pages/pos/store/order.selector';
import { setOrder } from '../pages/pos/store/order.actions';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('token')}`,
  })
};

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  protected mainURL = `${environment.apiURL}`;

  constructor(
    private http: HttpClient,
    private store: Store,
    private receiptService: ReceiptService,
  ) { }

  public cloudbackup()
  {
    this.store.select(selectAllItems).pipe(
      map(item => item.filter(data => data.backup != true)),
      take(1),
    ).subscribe(noBackup => {
      if (noBackup.length > 0) {
        const updatingItem = noBackup[0];

        let requestType:Observable<any>;
        if (updatingItem.id > 100000)
          requestType = this.addInventory(updatingItem);
        else
          requestType = this.editInventory(updatingItem.id, updatingItem);

        requestType.pipe(
          take(1),
          catchError(error => {
            console.error('API Error:', error);
            return throwError('Something went wrong.');
          })
        ).subscribe(savedData => {
          // delete store data.  
      		this.store.dispatch(deleteItem(updatingItem.id));	

          // add store data.
      		this.store.dispatch(AddItem({...savedData, backup: true}));

          // Update each order item id.
          this.store.select(selectAllOrders).pipe(take(1)).subscribe(orders => {
            const rawOrders = orders.filter(order => order.item === updatingItem.id);
            rawOrders.map(order => {
              this.store.dispatch(setOrder({order: {...order, item: savedData.id }}))
            })
          });

          // Trigger again.
          setTimeout(() => {
            this.cloudbackup();
          }, 900);
        });
      } else {
        this.receiptService.cloudbackup();
        this.fetchCloudData();
      }
    })
  }

  addInventory(item: Item) {
    return this.http.post<any>(this.mainURL+"inventory/", item, httpOptions);
  }

  editInventory(id:number, item: Item) {
    return this.http.put<any>(this.mainURL+"inventory/"+id+"/", item, httpOptions);
  }

  fetchCloudData() {
    this.http.get<any[]>(this.mainURL+"inventory/").pipe(take(1)).subscribe(items => {
      items.filter(item => !item.deleted_at).map(liveItem => {
        // delete store data.  
        this.store.dispatch(deleteItem(liveItem.id));	

        // add store data.
        this.store.dispatch(AddItem({...liveItem, backup: true}));
      });
    });
  }
}
