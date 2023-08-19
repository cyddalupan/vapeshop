import { createReducer, on } from "@ngrx/store";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { AddItem, InitializeItem, SetItem, deleteItem, updateItem } from "./inventory.action";
import { Item } from "../models";

export interface State extends EntityState<Item> {
  selectedItemId: number;
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialState: State = adapter.getInitialState({
  selectedItemId: 0
});

export const inventoryReducer = createReducer(
  initialState,
  on(InitializeItem, (state, { localStorage }) => {
    return localStorage;
  }),
  on(SetItem, (state, { itemId }) => ({...state, selectedItemId: itemId})),
  on(AddItem, (state, { item }) => {
    return adapter.addOne(item, state)
  }),
  on(updateItem, (state, { item }) => {
    return adapter.setOne(item, state);
  }),
  on(deleteItem, (state, { itemId }) => {
    return adapter.removeOne(itemId, state);
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
