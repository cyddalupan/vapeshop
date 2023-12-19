import { createAction } from "@ngrx/store";
import { Item } from "../models";

export enum ItemActions {
  InitItem = '[Item] Initialize Item',
  FeedItem = '[Item] Feed Item',
  AddItem = '[Item] Add Item',
  AddItemDone = '[Item] Add Item Done',
  SetItem = '[Item] Set Item',
  UpdateItem = '[Item] Update Item',
  UpdateItemDone = '[Item] Update Item Done',
  DeleteItem = '[Item] Delete Item',
}

export const InitializeItem = createAction(
  ItemActions.InitItem,
  (localStorage: any) => ({ localStorage })
);

export const SetItem = createAction(
  ItemActions.SetItem,
  (itemId: number) => ({ itemId })
);

export const FeedItem = createAction(
  ItemActions.FeedItem,
  (item: Item) => ({ item })
);

export const AddItem = createAction(
  ItemActions.AddItem,
  (item: Item) => ({ item })
);

export const AddItemDone = createAction(
  ItemActions.AddItemDone,
  (item: Item) => ({ item })
);

export const updateItem = createAction(
  ItemActions.UpdateItem,
  (item: Item) => ({ item })
);

export const updateItemDone = createAction(
  ItemActions.UpdateItemDone,
  (item: Item) => ({ item })
);

export const deleteItem = createAction(
  ItemActions.DeleteItem,
  (itemId: number) => ({ itemId })
);