import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Receipt } from "../models";
import { createReducer, on } from "@ngrx/store";

import * as ReceiptActions from './receipt.actions';

export interface State extends EntityState<Receipt> {
  // additional entities state properties
  selectedReceiptId: number | null;
}
 
export const adapter: EntityAdapter<Receipt> = createEntityAdapter<Receipt>();
 
export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedReceiptId: null,
});
 
export const receiptReducer = createReducer(
  initialState,
  on(ReceiptActions.InitializeReceipt, (state, { localStorage }) => {
    return localStorage;
  }),
  on(ReceiptActions.setSelectedReceipt, (state, { id }) => ({...state, selectedReceiptId: id})),
  on(ReceiptActions.addReceipt, (state, { receipt }) => {
    return adapter.addOne(receipt, state)
  }),
  on(ReceiptActions.setReceipt, (state, { receipt }) => {
    return adapter.setOne(receipt, state)
  }),
  on(ReceiptActions.upsertReceipt, (state, { receipt }) => {
    return adapter.upsertOne(receipt, state);
  }),
  on(ReceiptActions.addReceipts, (state, { receipts }) => {
    return adapter.addMany(receipts, state);
  }),
  on(ReceiptActions.upsertReceipts, (state, { receipts }) => {
    return adapter.upsertMany(receipts, state);
  }),
  on(ReceiptActions.updateReceipt, (state, { update }) => {
    return adapter.updateOne(update, state);
  }),
  on(ReceiptActions.updateReceipts, (state, { updates }) => {
    return adapter.updateMany(updates, state);
  }),
  on(ReceiptActions.mapReceipt, (state, { entityMap }) => {
    return adapter.mapOne(entityMap, state);
  }),
  on(ReceiptActions.mapReceipts, (state, { entityMap }) => {
    return adapter.map(entityMap, state);
  }),
  on(ReceiptActions.deleteReceipt, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),
  on(ReceiptActions.deleteReceipts, (state, { ids }) => {
    return adapter.removeMany(ids, state);
  }),
  on(ReceiptActions.deleteReceiptsByPredicate, (state, { predicate }) => {
    return adapter.removeMany(predicate, state);
  }),
  on(ReceiptActions.loadReceipts, (state, { receipts }) => {
    return adapter.setAll(receipts, state);
  }),
  on(ReceiptActions.setReceipts, (state, { receipts }) => {
    return adapter.setMany(receipts, state);
  }),
  on(ReceiptActions.clearReceipts, state => {
    return adapter.removeAll({ ...state, selectedReceiptId: null });
  })
);
 
 
export const getSelectedReceiptId = (state: State) => state.selectedReceiptId;
 
// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
 
// select the array of receipt ids
export const selectReceiptIds = selectIds;
 
// select the dictionary of receipt entities
export const selectReceiptEntities = selectEntities;
 
// select the array of receipts
export const selectAllReceipts = selectAll;
 
// select the total receipt count
export const selectReceiptTotal = selectTotal;