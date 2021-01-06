import type { CallEffect, PutEffect, TakeEffect } from 'redux-saga/effects';
import type { Store } from 'redux';
import type { EventChannel, Saga } from 'redux-saga';

import type { AppState } from 'containers/App/types';

export interface InjectedStore extends Store {
  injectedReducers: unknown;
  injectedSagas: unknown;
  runSaga: <S extends Saga>(saga: S, ...args: Parameters<S>) => unknown;
}

export interface ApplicationRootState {
  readonly global: AppState;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type SagaGeneratorType = Generator<CallEffect<EventChannel<unknown>> | TakeEffect | PutEffect<{ type: string }>, void, { progress?: number | undefined; error: boolean; success: boolean}>;
