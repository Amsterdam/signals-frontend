// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { act, renderHook } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import * as reactRouterDom from 'react-router-dom'
import * as reactRedux from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { store } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'
import { useReporter } from '../useReporter'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

fetchMock.disableMocks()

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const INCIDENT_ID = '4440'

describe('Reporter hook', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id: INCIDENT_ID,
    }))
  })

  it('returns reporter data', async () => {
    const FIRST = {
      isLoading: true,
      reporter: {
        email: undefined,
        incidents: undefined,
        originalIncidentId: INCIDENT_ID,
      },
      selectedIncident: undefined,
      selectedIncidentId: undefined,
    }

    const SECOND = {
      ...FIRST,
      isLoading: false,
      reporter: expect.objectContaining({
        email: 'me@email.com',
        incidents: expect.objectContaining({
          count: 2,
        }),
        originalIncidentId: INCIDENT_ID,
      }),
      selectedIncidentId: Number(INCIDENT_ID),
    }

    const THIRD = {
      ...SECOND,
      selectedIncident: expect.objectContaining({
        id: Number(INCIDENT_ID),
      }),
    }

    const { result, waitForNextUpdate } = renderHook(() => useReporter(), {
      wrapper: Provider,
      initialProps: { store },
    })

    // Expect loading
    expect(result.current).toEqual(expect.objectContaining(FIRST))

    await waitForNextUpdate()

    // Expect reporter request and incident request data
    expect(result.current).toEqual(expect.objectContaining(SECOND))

    await waitForNextUpdate()

    // Expect selected incident request data
    expect(result.current).toEqual(expect.objectContaining(THIRD))
  })

  it('supports changing selected incident', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useReporter(), {
      wrapper: Provider,
      initialProps: { store },
    })

    await waitForNextUpdate()
    await waitForNextUpdate()

    mockRequestHandler({
      body: {
        ...incidentFixture,
        id: 12345,
      },
    })

    act(() => {
      result.current.setSelectedIncidentId(1234)
    })

    await waitForNextUpdate()

    expect(result.current.selectedIncident?.id).toBe(12345)
  })

  it('handles errors', async () => {
    mockRequestHandler({
      status: 500,
      body: 'Something went wrong',
    })

    const { waitForNextUpdate } = renderHook(() => useReporter(), {
      wrapper: Provider,
      initialProps: { store },
    })

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
