import { createAction } from "@ngrx/store";
import { Item } from "../model/store.model";

export enum ItemActions {
  AddItem = '[Item] Add Item',
  SetItem = '[Item] Set Item',
  UpdateItem = '[Item] Update Item',
  DeleteItem = '[Item] Delete Item',
}

export const AddItem = createAction(
  ItemActions.AddItem,
  (item: Item) => ({ item })
);

export const SetItem = createAction(
  ItemActions.SetItem,
  (itemId: number) => ({ itemId })
);

export const updateItem = createAction(
  ItemActions.UpdateItem,
  (item: Item) => ({ item })
);