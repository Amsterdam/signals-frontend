// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import getInjectorsSagas from 'utils/sagaInjectors';

const injectSagaModel = (key, saga, store) => {
  getInjectorsSagas(store).injectSaga(key, { saga });
};

export default injectSagaModel;
