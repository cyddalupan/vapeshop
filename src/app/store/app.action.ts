import { createAction, props } from '@ngrx/store';

export const UpdateSyncCount = createAction(
  '[App] Update Sync Count',
  props<{ count: number; }>()
);
