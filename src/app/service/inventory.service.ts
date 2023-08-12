import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environment/environment';
import { Crud, Item } from '../pages/inventory/model/store.model';
import { map, take } from 'rxjs';
import { selectAllItems } from '../pages/inventory/store/inventory.selector';

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
    console.log("cloud backup");
    this.store.select(selectAllItems).pipe(
      map(item => item.filter(data => data.backup != true)),
      take(1),
    ).subscribe(noBackup => {
      if (noBackup.length > 1) {
        console.log("data to backup:",noBackup[0]);
        
        const updatingItem = noBackup[0];

        if (updatingItem.crud === Crud.ADD) {
          this.addInventory(updatingItem).subscribe(savedData => {
            console.log("savedData",savedData);
            // Before all. 
            // Figure out the fix for new data that has been edited
            // Consider all in one store to backup


            // Add new data
            // Delete old data
            // Change backup to true.
            // check if more data to backup

            //if no data then stop
          });
        }
      }
    });
    
    // const item: Item = {
    //   id: 0,
    //   code: 999,
    //   name: "nine",
    //   price: 99,
    //   desc: "another test",
    //   updated_at: String(Date.now()),
    // };
  }

  addInventory(item: Item) {
    return this.http.post<any>(this.mainURL+"inventory/", item, httpOptions).pipe(take(1));
  }
}
