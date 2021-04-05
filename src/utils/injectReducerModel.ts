// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { Reducer } from 'redux';
import type { InjectedStore } from 'types';
import { getInjectors } from 'utils/reducerInjectors';

const injectReducerModel = <T>(key: string, reducer: Reducer<T>, store: InjectedStore) => {
  getInjectors(store).injectReducer(key, reducer);
};

export default injectReducerModel
