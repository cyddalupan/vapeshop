import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environment/environment';
import { selectAllReceipts } from '../pages/pos/store/receipt.selector';
import { Observable, catchError, map, take, throwError } from 'rxjs';
import { Receipt } from '../pages/pos/models';
import { deleteReceipt } from '../pages/pos/store/receipt.actions';
import { OrderService } from './order.service';
import { selectAllOrders } from '../pages/pos/store/order.selector';
import { setOrder } from '../pages/pos/store/order.actions';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService implements OnInit {
  protected mainURL = `${environment.apiURL}`;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private store: Store,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      })
    };
  }

 	public getAllReceipt() {
    return this.http.get<any[]>(this.mainURL+"pos/receipt").pipe(take(1));
	}

  public cloudbackup()
  {
    this.store.select(selectAllReceipts).pipe(
      map(receipt => receipt.filter(data => data.backup != true)),
      take(1),
    ).subscribe(noBackup => {
      if (noBackup.length > 0) {
        const updatingReceipt = noBackup[0];

        let requestType:Observable<any>;
        if (updatingReceipt.id > 10000000)
          requestType = this.addApi(updatingReceipt);
        else
          requestType = this.editApi(updatingReceipt.id, updatingReceipt);

        requestType.pipe(
          take(1),
          catchError(error => {
            console.error('API Error:', error);
            return throwError('Something went wrong.');
          })
        ).subscribe(savedData => {
          // delete store data.  
          this.store.dispatch(deleteReceipt({ id: updatingReceipt.id }));	

          // Update each order receipt id.
          this.store.select(selectAllOrders).pipe(take(1)).subscribe(orders => {
            const rawOrders = orders.filter(order => order.receipt === updatingReceipt.id);
            rawOrders.map(order => {
              this.store.dispatch(setOrder({order: {...order, receipt: savedData.id }}))
            })
          });

          // Trigger again.
          setTimeout(() => {
            this.cloudbackup();
          }, 900);
        });
      } else {
        this.orderService.cloudbackup();
      }
    });
  }

  addApi(receipt: Receipt) {
    return this.http.post<any>(this.mainURL+"pos/receipt", receipt, this.httpOptions);
  }

  editApi(id:number, receipt: Receipt) {
    return this.http.put<any>(this.mainURL+"pos/receipt/"+id+"/", receipt, this.httpOptions);
  }
}

