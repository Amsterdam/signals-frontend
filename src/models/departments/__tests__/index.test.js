// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import injectReducerModel from 'utils/injectReducerModel'
import injectSagaModel from 'utils/injectSagaModel'

import reducer from '../reducer'
import saga from '../saga'

import loadModel from '..'

jest.mock('utils/injectReducerModel')
jest.mock('utils/injectSagaModel')

jest.mock('../reducer')
jest.mock('../saga')

describe('models/departments', () => {
  const store = { foo: 'bar' }
  let spy

  beforeEach(() => {
    spy = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should inject reducer', () => {
    injectReducerModel.mockImplementation(spy)
    loadModel(store)

    expect(spy).toHaveBeenCalledWith('departments', reducer, store)
  })

  it('should inject saga', () => {
    injectSagaModel.mockImplementation(spy)
    loadModel(store)

    expect(spy).toHaveBeenCalledWith('departments', saga, store)
  })
})
