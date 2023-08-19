import { createAction, props } from '@ngrx/store';
import { Update, EntityMap, EntityMapOne, Predicate } from '@ngrx/entity';
import { Receipt } from '../models';

export const loadReceipts = createAction('[Receipt/API] Load Receipts', props<{ receipts: Receipt[] }>());
export const setReceipts = createAction('[Receipt/API] Set Receipts', props<{ receipts: Receipt[] }>());
export const addReceipt = createAction('[Receipt/API] Add Receipt', props<{ receipt: Receipt }>());
export const setReceipt = createAction('[Receipt/API] Set Receipt', props<{ receipt: Receipt }>());
export const upsertReceipt = createAction('[Receipt/API] Upsert Receipt', props<{ receipt: Receipt }>());
export const addReceipts = createAction('[Receipt/API] Add Receipts', props<{ receipts: Receipt[] }>());
export const upsertReceipts = createAction('[Receipt/API] Upsert Receipts', props<{ receipts: Receipt[] }>());
export const updateReceipt = createAction('[Receipt/API] Update Receipt', props<{ update: Update<Receipt> }>());
export const updateReceipts = createAction('[Receipt/API] Update Receipts', props<{ updates: Update<Receipt>[] }>());
export const mapReceipt = createAction('[Receipt/API] Map Receipt', props<{ entityMap: EntityMapOne<Receipt> }>());
export const mapReceipts = createAction('[Receipt/API] Map Receipts', props<{ entityMap: EntityMap<Receipt> }>());
export const deleteReceipt = createAction('[Receipt/API] Delete Receipt', props<{ id: string }>());
export const deleteReceipts = createAction('[Receipt/API] Delete Receipts', props<{ ids: string[] }>());
export const deleteReceiptsByPredicate = createAction('[Receipt/API] Delete Receipts By Predicate', props<{ predicate: Predicate<Receipt> }>());
export const clearReceipts = createAction('[Receipt/API] Clear Receipts');