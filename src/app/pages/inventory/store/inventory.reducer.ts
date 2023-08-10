import { createReducer, on } from "@ngrx/store";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { AddItem, SetItem } from "./inventory.action";
import { Item } from "../model/store.model";

export interface State extends EntityState<Item> {
  selectedItemId: number;
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialState: State = adapter.getInitialState({
  selectedItemId: 0
});

export const inventoryReducer = createReducer(
  initialState,
  on(SetItem, (state, { itemId }) => ({...state, selectedItemId: itemId})),
  on(AddItem, (state, { item }) => {
		if (!(item.id))
			item = {...item, id: Number(Date.now())};
    return adapter.addOne(item, state)
  }),
)

export const getSelectedItemId = (state: State) => state.selectedItemId;

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectItemIds = selectIds;

export const selectItemEntities = selectEntities;

export const selectAllItems = selectAll;

export const selectItemTotal = selectTotal;
