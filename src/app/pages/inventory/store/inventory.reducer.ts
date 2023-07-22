import { createReducer } from "@ngrx/store";
import { InventoryStoreModel } from "../model/store.model";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";

export interface State extends EntityState<InventoryStoreModel> {}

export const adapter: EntityAdapter<InventoryStoreModel> = createEntityAdapter<InventoryStoreModel>();

export const initialState: State = adapter.getInitialState({
  ids: [1,2],
  entities: [
    {
      id: 1,
      code: 4800488959878,
      name: 'Nursy',
      price: 133,
      created_at: '2012',
      updated_at: '2013',
      deleted_at: null,
    },
    {
      id: 1,
      code: 3333,
      name: 'two',
      price: 321,
      created_at: '2012',
      updated_at: '2013',
      deleted_at: null,
    },
  ]
});

export const inventoryReducer = createReducer(
  initialState,
)