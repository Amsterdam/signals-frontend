// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { Store } from 'redux';
import getInjectorsSagas from 'utils/sagaInjectors';


const injectSagaModel = (key: string, saga: unknown, store: Partial<Store>) => {
  getInjectorsSagas(store).injectSaga(key, { saga });
};

export default injectSagaModel
