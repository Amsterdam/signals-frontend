// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { store } from 'test/utils'

import loadModels from '.'
import loadHistoryModel from './history'

jest.mock('./history')

describe('loadModels', () => {
  let spy

  beforeEach(() => {
    spy = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load history model', () => {
    loadHistoryModel.mockImplementation(spy)
    loadModels(store)

    expect(spy).toHaveBeenCalledWith(store)
  })
})
