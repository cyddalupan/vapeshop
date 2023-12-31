import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InventoryService } from "src/app/service/inventory.service";
import { ItemActions } from "./inventory.action";
import { EMPTY, catchError, exhaustMap, map, of } from "rxjs";

@Injectable()
export class InventoryEffects {
  
  AddItem$ = createEffect(() => this.actions$.pipe(
    ofType(ItemActions.AddItem),
    exhaustMap((action: any) => this.inventoryService.addInventory(action.item)
      .pipe(
        map(item => ({ type: ItemActions.AddItemDone, payload: item })),
        catchError(() => EMPTY)
      ))
    )
  );

  updateItem$ = createEffect(() => this.actions$.pipe(
    ofType(ItemActions.UpdateItem),
    exhaustMap((action: any) => this.inventoryService.editInventory(action.item.id, action.item)
      .pipe(
        map(item => ({ type: ItemActions.UpdateItemDone, payload: item })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private inventoryService: InventoryService
  ) {}
}