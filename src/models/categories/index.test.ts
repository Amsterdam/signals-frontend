// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import injectReducerModel from 'utils/injectReducerModel'
import injectSagaModel from 'utils/injectSagaModel'
import { mocked } from 'jest-mock'

import loadModel from '..'
import reducer from './reducer'
import saga from './saga'

jest.mock('utils/injectReducerModel')
jest.mock('utils/injectSagaModel')

jest.mock('./reducer')
jest.mock('./saga')

describe('models/categories', () => {
  const store = { foo: 'bar' }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should inject reducer', () => {
    const spy = jest.fn()
    mocked(injectReducerModel).mockImplementation(spy)
    loadModel(store)

    expect(spy).toHaveBeenCalledWith('categories', reducer, store)
  })

  it('should inject saga', () => {
    const spy = jest.fn()
    mocked(injectSagaModel).mockImplementation(spy)
    loadModel(store)

    expect(spy).toHaveBeenCalledWith('categories', saga, store)
  })
})
