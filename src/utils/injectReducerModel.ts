// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { Store } from 'redux';
import getInjectorsReducer from 'utils/reducerInjectors';

const injectReducerModel = (key: string, reducer: unknown, store: Partial<Store>) => {
  getInjectorsReducer(store).injectReducer(key, reducer);
};

export default injectReducerModel
