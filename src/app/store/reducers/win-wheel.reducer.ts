import { createReducer, on } from '@ngrx/store';

import {
  getWinWheelDataSuccess,
  getWinWheelDataFailed,
  getWinWheelDataReset,
} from 'app/store/actions/win-wheel.actions';
import { WinWheelModel } from '@app/interfaces/win-wheel.interface';
import { GenericReducerState } from '@app/interfaces/general-reducer-state.interface';

export const initialState: GenericReducerState<WinWheelModel> = {
  data: null,
  isLoading: false,
  errMsg: '',
};

const _winWheelReducer = createReducer(
  initialState,
  on(getWinWheelDataSuccess, (state, action) => ({
    ...state,
    isLoading: initialState.isLoading,
    errMsg: initialState.errMsg,
    data: action.payload,
  })),
  on(getWinWheelDataFailed, (state, action) => ({
    ...state,
    isLoading: initialState.isLoading,
    errMsg: action.payload,
    data: initialState.data,
  })),
  on(getWinWheelDataReset, () => ({
    ...initialState,
  }))
);

export function winWheelReducer(state: any, action: any) {
  return _winWheelReducer(state, action);
}
