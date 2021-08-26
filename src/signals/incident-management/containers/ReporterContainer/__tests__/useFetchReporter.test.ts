// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { act, renderHook } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import * as reactRedux from 'react-redux'
import fetchMock from 'jest-fetch-mock'

import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { store } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import configuration from 'shared/services/configuration/configuration'
import type { Result } from 'types/api/reporter'
import { waitFor } from '@testing-library/react'
import {
  mockRequestHandler,
  rest,
  server,
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
const INCIDENT_ID_2 = '4441'
const INCIDENT_ID_3 = '4442'

const REPORTER_MOCK: Result = {
  id: 0,
  created_at: new Date(0).toISOString(),
  category: {
    sub: 'foo',
    sub_slug: 'foo',
    main: 'foo',
    main_slug: 'foo',
    departments: 'foo',
  },
  status: {
    state: 'foo',
    state_display: 'foo',
  },
  feedback: null,
  can_view_signal: false,
  has_children: false,
}

describe('Fetch Reporter hook', () => {
  it('correctly implements pagination', async () => {
    mockRequestHandler({
      body: {
        ...incidentFixture,
        id: 12345,
      },
    })

    server.use(
      rest.get(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${INCIDENT_ID}/context/reporter`,
        (req, res, ctx) => {
          const query = req.url.searchParams
          const page = query.get('page')
          return res(
            ctx.status(200),
            ctx.json({
              count: 8,
              results: [{ ...REPORTER_MOCK, id: Number(page) }],
            })
          )
        }
      )
    )

    const { result, waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await waitForNextUpdate({ timeout: 10000 })

    expect(result.current.incidents.data?.list[0].id).toEqual(1)
    expect(result.current.currentPage).toEqual(1)

    act(() => {
      result.current.setCurrentPage(2)
    })

    await waitForNextUpdate({ timeout: 10000 })

    expect(result.current.incidents.data?.list[0].id).toEqual(2)
    expect(result.current.currentPage).toEqual(2)
  })

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
        canView: true,
        id: Number(INCIDENT_ID),
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
        canView: true,
        id: Number(INCIDENT_ID),
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

    await waitForNextUpdate({ timeout: 10000 })

    // Expect incidents result
    expect(result.current).toEqual(expect.objectContaining(SECOND))

    await waitForNextUpdate({ timeout: 10000 })

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

    await waitForNextUpdate({ timeout: 10000 })

    mockRequestHandler({
      body: {
        ...incidentFixture,
        id: Number(INCIDENT_ID_2),
      },
    })

    act(() => {
      result.current.selectIncident(Number(INCIDENT_ID_2))
    })

    await waitFor(
      () => expect(result.current.incident?.id).toBe(Number(INCIDENT_ID_2)),
      { timeout: 3000 }
    )
    await waitFor(
      () =>
        expect(result.current.incident?.data?.id).toBe(Number(INCIDENT_ID_2)),
      { timeout: 3000 }
    )
  })

  it('does not fetch incident for which the user has no permission', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await waitForNextUpdate({ timeout: 10000 })
    await waitForNextUpdate({ timeout: 10000 })

    // User has no permission to view incident data for incident with id={INCIDENT_ID_3}
    expect(
      result.current.incidents.data?.list.find(
        ({ id }) => id === Number(INCIDENT_ID_3)
      )?.canView
    ).toBe(false)

    act(() => {
      result.current.selectIncident(Number(INCIDENT_ID_3))
    })

    expect(result.current.incident.isLoading).toBe(false)
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

    await waitForNextUpdate({ timeout: 10000 })

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
