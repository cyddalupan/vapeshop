import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environment/environment';
import { selectAllOrders } from '../pages/pos/store/order.selector';
import { Observable, catchError, map, take, throwError } from 'rxjs';
import { Order } from '../pages/pos/models';
import { deleteOrder } from '../pages/pos/store/order.actions';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('token')}`,
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  protected mainURL = `${environment.apiURL}`;

  constructor(
    private http: HttpClient,
    private store: Store) { }

 	public getAllOrder() {
    return this.http.get<any[]>(this.mainURL+"pos/order").pipe(take(1));
	}

  public cloudbackup()
  {
    this.store.select(selectAllOrders).pipe(
      map(order => order.filter(data => data.backup != true)),
      take(1),
    ).subscribe(noBackup => {
      if (noBackup.length > 0) {
        const updatingOrder = noBackup[0];

        let requestType:Observable<any>;
        if (updatingOrder.id > 10000000)
          requestType = this.addApi(updatingOrder);
        else
          requestType = this.editApi(updatingOrder.id, updatingOrder);

        requestType.pipe(
          take(1),
          catchError(error => {
            console.error('API Error:', error);
            return throwError('Something went wrong.');
          })
        ).subscribe(savedData => {
          // delete store data.  
          this.store.dispatch(deleteOrder({ id: updatingOrder.id }));	

          // Trigger again.
          setTimeout(() => {
            this.cloudbackup();
          }, 900);
        });
      }
    });
  }

  addApi(order: Order) {
    return this.http.post<any>(this.mainURL+"pos/order", order, httpOptions);
  }

  editApi(id:number, order: Order) {
    return this.http.put<any>(this.mainURL+"pos/order/"+id+"/", order, httpOptions);
  }
}
