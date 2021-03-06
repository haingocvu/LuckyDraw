import { createSelector } from '@ngrx/store';
import { IStoreState } from '@app/interfaces/store.interface';
import { IWinWheel } from '@app/interfaces/win-wheel.interface';
import { IGenericReducerState } from '@app/interfaces/general-reducer-state.interface';

const selectWinWheelData = (state: IStoreState) => state.winWheelData;

export const winWheelDataSelector = createSelector(
  selectWinWheelData,
  (state: IGenericReducerState<IWinWheel>) => state
);

export const winWheelRulesSelector = createSelector(
  selectWinWheelData,
  (state: IGenericReducerState<IWinWheel>) => state.data?.rules
);

export const campaignNameSelector = createSelector(
  selectWinWheelData,
  (state: IGenericReducerState<IWinWheel>) => state.data?.name
);
