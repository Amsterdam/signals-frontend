// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import * as Sentry from '@sentry/browser'
import { call, put, takeLatest } from 'redux-saga/effects'

import * as actions from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { authCall } from 'shared/services/api/api'

import { requestHistoryListError, requestHistoryListSuccess } from './actions'
import { REQUEST_HISTORY_LIST } from './constants'
import watchHistorySaga, { fetchHistoryList } from './saga'

jest.mock('shared/services/api/api')
jest.mock('./selectors', () => {
  function mockedMakeSelectFilterParams() {}
  return {
    makeSelectFilterParams: () => mockedMakeSelectFilterParams,
  }
})
jest.mock('@sentry/browser')
jest.mock('containers/App/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/actions'),
}))

describe('history saga', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should watchIncidentHistoryContainerSaga', () => {
    const gen = watchHistorySaga()
    expect(gen.next().value).toEqual(
      takeLatest(REQUEST_HISTORY_LIST, fetchHistoryList)
    ) // eslint-disable-line redux-saga/yield-effects
  })

  it('should fetchHistoryList success', () => {
    const list = { results: [], count: 55 }
    const action = { payload: 42 }

    const gen = fetchHistoryList(action)
    expect(gen.next().value).toEqual(authCall()) // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(list).value).toEqual(put(requestHistoryListSuccess(list))) // eslint-disable-line redux-saga/yield-effects
    gen.next()
  })

  it('should fetchHistoryList error', () => {
    const notificationSpy = jest.spyOn(actions, 'showGlobalNotification')
    const action = { payload: 42 }
    const error = new Error('404 Not Found')

    const gen = fetchHistoryList(action)

    gen.next()

    expect(gen.throw(error).value).toEqual(put(requestHistoryListError(error)))

    expect(notificationSpy).not.toHaveBeenCalled()

    gen.next()

    expect(notificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'De melding geschiedenis kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )

    expect(gen.next().value).toEqual(call([Sentry, 'captureException'], error))
  })
})
