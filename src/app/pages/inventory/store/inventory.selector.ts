import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromInventory from './inventory.reducer';

export const selectInventoryState = createFeatureSelector<fromInventory.State>('inventory');

export const selectItemIds = createSelector(
  selectInventoryState,
  fromInventory.selectItemIds
);

export const selectItemEntities = createSelector(
  selectInventoryState,
  fromInventory.selectItemEntities
);

export const selectAllItems = createSelector(
  selectInventoryState,
  fromInventory.selectAllItems
);

export const selectItemTotal = createSelector(
  selectInventoryState,
  fromInventory.selectItemTotal
);

export const selectCurrentItemId = createSelector(
  selectInventoryState,
  fromInventory.getSelectedItemId
);
 
export const selectCurrentItem = createSelector(
  selectItemEntities,
  selectCurrentItemId,
  (itemEntities, itemId) => itemId && itemEntities[itemId]
);
