// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { Reducer } from 'redux';
import type { InjectedStore } from 'types';
import getInjectorsReducer from 'utils/reducerInjectors';

const injectReducerModel = <T>(key: string, reducer: Reducer<T>, store: InjectedStore) => {
  getInjectorsReducer(store).injectReducer(key, reducer);
};

export default injectReducerModel
