import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environment/environment';
import { Item } from '../pages/inventory/model/store.model';
import { Observable, catchError, map, take, throwError } from 'rxjs';
import { selectAllItems } from '../pages/inventory/store/inventory.selector';
import { AddItem, deleteItem } from '../pages/inventory/store/inventory.action';

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
    private store: Store) { }

  public cloudbackup()
  {
    this.store.select(selectAllItems).pipe(
      map(item => item.filter(data => data.backup != true)),
      take(1),
    ).subscribe(noBackup => {
      if (noBackup.length > 0) {
        const updatingItem = noBackup[0];

        let requestType:Observable<any>;
        if (updatingItem.id > 1000)
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

          // Trigger again.
          this.cloudbackup();
        });
      }
    });
  }

  addInventory(item: Item) {
    return this.http.post<any>(this.mainURL+"inventory/", item, httpOptions);
  }

  editInventory(id:number, item: Item) {
    return this.http.put<any>(this.mainURL+"inventory/"+id+"/", item, httpOptions);
  }
}
