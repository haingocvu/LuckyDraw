import { createReducer, on } from '@ngrx/store';

import {
  setTurnCount,
  setRemainingRewards,
} from '@app/store/actions/combine.actions';
import { ICombineState } from '@app/interfaces/combine.interface';

export const initialState: ICombineState = {
  // @ts-ignore
  remainingRewards: null,
  remainingTurns: 0,
};

const _combineReducer = createReducer(
  initialState,
  on(setTurnCount, (state, action) => ({
    ...state,
    remainingTurns: action.payload,
  })),
  on(setRemainingRewards, (state, action) => ({
    ...state,
    remainingRewards: action.payload,
  }))
);

export function combineReducer(state: any, action: any) {
  return _combineReducer(state, action);
}
