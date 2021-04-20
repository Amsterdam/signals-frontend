// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import getInjectorsSaga from 'utils/sagaInjectors'

import injectSagaModel from './injectSagaModel'

jest.mock('utils/sagaInjectors')

describe('injectSagaModel', () => {
  const mockSaga = jest.fn()
  const store = { foo: 'bar' }

  it('should inject model into saga', () => {
    const spy = jest.fn()

    getInjectorsSaga.mockImplementation(() => ({
      injectSaga: spy,
    }))
    injectSagaModel('mockKey', mockSaga, store)

    expect(getInjectorsSaga).toHaveBeenCalledWith(store)
    expect(spy).toHaveBeenCalledWith('mockKey', { saga: mockSaga })

    jest.resetAllMocks()
  })
})
