// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { InjectedStore } from 'types'
import { getInjectors } from 'utils/sagaInjectors'

const injectSagaModel = (key: string, saga: unknown, store: InjectedStore) => {
  getInjectors(store).injectSaga(key, { saga })
}

export default injectSagaModel
