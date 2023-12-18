import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, exhaustMap, map, of, tap } from "rxjs";
import { OrderService } from "src/app/service/order.service";
import * as OrderActions from './order.actions';

@Injectable()
export class OrderEffects {
  
  initAddOrder$ = createEffect(() => this.actions$.pipe(
    ofType(OrderActions.initAddOrder),
    exhaustMap((action: any) => this.orderService.addApi(action.order)
      .pipe(
        map(order => ({ type: '[Order/API] Add Order', order })),
        catchError(() => EMPTY)
      ))
    )
  );

  initSetOrder$ = createEffect(() => this.actions$.pipe(
    ofType(OrderActions.initSetOrder),
    exhaustMap((action: any) => this.orderService.editApi(action.order.id, action.order)
      .pipe(
        map(order => ({ type: '[Order/API] Set Order', order })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private orderService: OrderService
  ) {}
}
