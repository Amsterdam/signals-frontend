// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { act, renderHook } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import * as reactRedux from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { store } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'
import { FetchReporterHook, useFetchReporter } from '../useFetchReporter'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

fetchMock.disableMocks()

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const INCIDENT_ID = '4440'

describe('Fetch Reporter hook', () => {
  it('returns incident(s) data', async () => {
    const FIRST: Partial<FetchReporterHook> = {
      incident: {
        isLoading: false,
        data: undefined,
      },
      incidents: {
        isLoading: true,
        data: undefined,
      },
    }

    const SECOND: Partial<FetchReporterHook> = {
      ...FIRST,
      incident: {
        isLoading: true,
        data: undefined,
      },
      incidents: {
        isLoading: false,
        data: expect.objectContaining({
          count: 2,
        }),
      },
    }

    const THIRD: Partial<FetchReporterHook> = {
      ...SECOND,
      incident: {
        isLoading: false,
        data: expect.objectContaining({
          id: Number(INCIDENT_ID),
        }),
      },
    }

    const { result, waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    // Expect loading
    expect(result.current).toEqual(expect.objectContaining(FIRST))

    await waitForNextUpdate()

    // Expect incidents result
    expect(result.current).toEqual(expect.objectContaining(SECOND))

    await waitForNextUpdate()

    // Expect incident request data
    expect(result.current).toEqual(expect.objectContaining(THIRD))
  })

  it('supports selecting an incident', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await waitForNextUpdate()
    await waitForNextUpdate()

    mockRequestHandler({
      body: {
        ...incidentFixture,
        id: 12345,
      },
    })

    act(() => {
      result.current.selectIncident(1234)
    })

    await waitForNextUpdate()

    expect(result.current.incident?.data?.id).toBe(12345)
  })

  it('handles errors', async () => {
    mockRequestHandler({
      status: 500,
      body: 'Something went wrong',
    })

    const { waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification(
        expect.objectContaining({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    )
  })
})
