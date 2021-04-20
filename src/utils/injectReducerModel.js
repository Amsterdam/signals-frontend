// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import getInjectorsReducer from 'utils/reducerInjectors'

const injectReducerModel = (key, reducer, store) => {
  getInjectorsReducer(store).injectReducer(key, reducer)
}

export default injectReducerModel
