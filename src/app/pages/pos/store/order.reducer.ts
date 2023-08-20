import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Order } from "../models";
import { createReducer, on } from "@ngrx/store";

import * as OrderActions from './order.actions';

export interface State extends EntityState<Order> {
  // additional entities state properties
  selectedOrderId: number | null;
}
 
export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>();
 
export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedOrderId: null,
});
 
export const orderReducer = createReducer(
  initialState,
  on(OrderActions.setSelectedOrder, (state, { id }) => ({...state, selectedOrderId: id})),
  on(OrderActions.addOrder, (state, { order }) => {
    return adapter.addOne(order, state)
  }),
  on(OrderActions.setOrder, (state, { order }) => {
    return adapter.setOne(order, state)
  }),
  on(OrderActions.upsertOrder, (state, { order }) => {
    return adapter.upsertOne(order, state);
  }),
  on(OrderActions.addOrders, (state, { orders }) => {
    return adapter.addMany(orders, state);
  }),
  on(OrderActions.upsertOrders, (state, { orders }) => {
    return adapter.upsertMany(orders, state);
  }),
  on(OrderActions.updateOrder, (state, { update }) => {
    return adapter.updateOne(update, state);
  }),
  on(OrderActions.updateOrders, (state, { updates }) => {
    return adapter.updateMany(updates, state);
  }),
  on(OrderActions.mapOrder, (state, { entityMap }) => {
    return adapter.mapOne(entityMap, state);
  }),
  on(OrderActions.mapOrders, (state, { entityMap }) => {
    return adapter.map(entityMap, state);
  }),
  on(OrderActions.deleteOrder, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),
  on(OrderActions.deleteOrders, (state, { ids }) => {
    return adapter.removeMany(ids, state);
  }),
  on(OrderActions.deleteOrdersByPredicate, (state, { predicate }) => {
    return adapter.removeMany(predicate, state);
  }),
  on(OrderActions.loadOrders, (state, { orders }) => {
    return adapter.setAll(orders, state);
  }),
  on(OrderActions.setOrders, (state, { orders }) => {
    return adapter.setMany(orders, state);
  }),
  on(OrderActions.clearOrders, state => {
    return adapter.removeAll({ ...state, selectedOrderId: null });
  })
);
 
 
export const getSelectedOrderId = (state: State) => state.selectedOrderId;
 
// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
 
// select the array of order ids
export const selectOrderIds = selectIds;
 
// select the dictionary of order entities
export const selectOrderEntities = selectEntities;
 
// select the array of orders
export const selectAllOrders = selectAll;
 
// select the total order count
export const selectOrderTotal = selectTotal;