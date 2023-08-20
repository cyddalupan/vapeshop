import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromOrder from './order.reducer';

export interface State {
  orders: fromOrder.State;
}

export const reducers: ActionReducerMap<State> = {
  orders: fromOrder.orderReducer,
};

export const selectOrderState = createFeatureSelector<fromOrder.State>('orders');

export const selectOrderIds = createSelector(
  selectOrderState,
  fromOrder.selectOrderIds // shorthand for ordersState => fromOrder.selectOrderIds(ordersState)
);
export const selectOrderEntities = createSelector(
  selectOrderState,
  fromOrder.selectOrderEntities
);
export const selectAllOrders = createSelector(
  selectOrderState,
  fromOrder.selectAllOrders
);
export const selectOrderTotal = createSelector(
  selectOrderState,
  fromOrder.selectOrderTotal
);
export const selectCurrentOrderId = createSelector(
  selectOrderState,
  fromOrder.getSelectedOrderId
);

export const selectCurrentOrder = createSelector(
  selectOrderEntities,
  selectCurrentOrderId,
  (orderEntities, orderId) => orderId && orderEntities[orderId]
);