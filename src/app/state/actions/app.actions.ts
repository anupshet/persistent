import { createAction } from '@ngrx/store';

export const ResetApp = createAction(
  '[App] Reset App'
);

export type AppActions = typeof ResetApp;
