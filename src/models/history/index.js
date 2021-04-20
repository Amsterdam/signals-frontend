// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import injectReducerModel from 'utils/injectReducerModel'
import injectSagaModel from 'utils/injectSagaModel'

import reducer from './reducer'
import saga from './saga'

const loadModel = (store) => {
  injectReducerModel('history', reducer, store)
  injectSagaModel('history', saga, store)
}

export default loadModel
