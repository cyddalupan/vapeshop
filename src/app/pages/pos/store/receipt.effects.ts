import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, exhaustMap, map, of, tap } from "rxjs";
import { ReceiptService } from "src/app/service/receipt.service";
import * as ReceiptActions from './receipt.actions';
import { Store } from "@ngrx/store";

@Injectable()
export class ReceiptEffects {
  
  loadAddReceipt$ = createEffect(() => this.actions$.pipe(
    ofType(ReceiptActions.loadAddReceipt),
    exhaustMap((action: any) => this.receiptService.addApi(action.receipt)
      .pipe(
        tap((receipt:any) => this.store.dispatch(ReceiptActions.setSelectedReceipt({ id: receipt.id }))),
        map(receipt => ({ type: '[Receipt/API] Add Receipt', receipt })),
        catchError(() => EMPTY)
      ))
    )
  );

  initSetReceipt$ = createEffect(() => this.actions$.pipe(
    ofType(ReceiptActions.initSetReceipt),
    exhaustMap((action: any) => this.receiptService.editApi(action.receipt.id, action.receipt)
      .pipe(
        map(receipt => ({ type: '[Receipt/API] Set Receipt', receipt })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private receiptService: ReceiptService
  ) {}
}