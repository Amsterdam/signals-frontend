// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { CallEffect, PutEffect, TakeEffect } from 'redux-saga/effects'
import type { Reducer, Store } from 'redux'
import type { EventChannel, Saga } from 'redux-saga'

import type { AppState } from 'containers/App/types'
import type { CategoriesState } from 'models/categories/reducer'

export interface ApplicationRootState {
  readonly global: AppState
  readonly categories: CategoriesState
  readonly test?: any
}

export interface InjectedStore extends Store {
  injectedReducers: Record<string, unknown>
  injectedSagas: Record<string, unknown>
  runSaga: <S extends Saga<any>>(saga: S, ...args: Parameters<S>) => any
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState
  reducer: Reducer<any, any>
}

export interface InjectSagaParams {
  key: keyof ApplicationRootState
  saga: () => IterableIterator<any>
  mode?: string | undefined
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type SagaGeneratorType = Generator<
  CallEffect<EventChannel<unknown>> | TakeEffect | PutEffect<{ type: string }>,
  void,
  { progress?: number | undefined; error: boolean; success: boolean }
>

export interface Action<T, ActionType> {
  type: T
  payload?: ActionType
}
