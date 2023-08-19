import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromReceipt from './receipt.reducer';

export interface State {
  receipts: fromReceipt.State;
}

export const reducers: ActionReducerMap<State> = {
  receipts: fromReceipt.receiptReducer,
};

export const selectReceiptState = createFeatureSelector<fromReceipt.State>('receipts');

export const selectReceiptIds = createSelector(
  selectReceiptState,
  fromReceipt.selectReceiptIds // shorthand for receiptsState => fromReceipt.selectReceiptIds(receiptsState)
);
export const selectReceiptEntities = createSelector(
  selectReceiptState,
  fromReceipt.selectReceiptEntities
);
export const selectAllReceipts = createSelector(
  selectReceiptState,
  fromReceipt.selectAllReceipts
);
export const selectReceiptTotal = createSelector(
  selectReceiptState,
  fromReceipt.selectReceiptTotal
);
export const selectCurrentReceiptId = createSelector(
  selectReceiptState,
  fromReceipt.getSelectedReceiptId
);

export const selectCurrentReceipt = createSelector(
  selectReceiptEntities,
  selectCurrentReceiptId,
  (receiptEntities, receiptId) => receiptId && receiptEntities[receiptId]
);