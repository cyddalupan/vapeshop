import { createFeatureSelector, createSelector } from '@ngrx/store';

import { App } from '../app.model';
 
export const SelectFeature = createFeatureSelector<App>('app');

export const SelectCount = createSelector(
  SelectFeature,
  (state) => state.unSyncTotal
);
