import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromInventory from './inventory.reducer';

export const selectInventoryState = createFeatureSelector<fromInventory.State>('inventory');

export const selectItemEntities = createSelector(
  selectInventoryState,
  fromInventory.selectItemEntities
);

export const selectCurrentItemId = createSelector(
  selectInventoryState,
  fromInventory.getSelectedItemId
);
 
export const selectCurrentItem = createSelector(
  selectItemEntities,
  selectCurrentItemId,
  (itemEntities, itemId) => itemId && itemEntities
);