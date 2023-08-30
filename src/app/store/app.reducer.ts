import { createReducer, on } from '@ngrx/store';

import { App } from '../app.model';
import * as AppActions from './app.action';

export const initialState: App = {
	unSyncTotal: 0,
};

export const appReducer = createReducer(
  initialState,
	on(AppActions.UpdateSyncCount,  (state, { count }) => ({ ...state, unSyncTotal: count })),
);
