import { createReducer, on } from "@ngrx/store";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { AddItem, SetItem } from "./inventory.action";
import { Item } from "../model/store.model";

export interface State extends EntityState<Item> {
  selectedItemId: string;
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialState: State = adapter.getInitialState({
  selectedItemId: ''
});

export const inventoryReducer = createReducer(
  initialState,
  on(SetItem, (state, { itemId }) => ({...state, selectedItemId: itemId})),
  on(AddItem, (state, { item }) => {
    return adapter.addOne(item, state)
  }),
)
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const getSelectedItemId = (state: State) => state.selectedItemId;

export const selectItemEntities = selectEntities;