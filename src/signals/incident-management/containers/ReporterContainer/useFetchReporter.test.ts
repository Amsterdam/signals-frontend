// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import { act, renderHook, cleanup } from '@testing-library/react-hooks'
import { http, HttpResponse } from 'msw'
import { Provider } from 'react-redux'
import * as reactRedux from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { store } from 'test/utils'
import type { Incident } from 'types/api/incident'
import type { Result } from 'types/api/reporter'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import * as API from './../../../../../internals/testing/api'
import { server } from './../../../../../internals/testing/msw-server'
import type { FetchReporterHook } from './useFetchReporter'
import { useFetchReporter } from './useFetchReporter'

const dispatch = jest.fn()
const reduxSpy = jest
  .spyOn(reactRedux, 'useDispatch')
  .mockImplementation(() => dispatch)

jest.mock('react-router-dom')
jest.mock('shared/services/configuration/configuration')

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

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Fetch Reporter hook', () => {
  afterEach(cleanup)
  afterAll(() => {
    reduxSpy.mockRestore()
  })

  it('correctly implements pagination', async () => {
    server.use(
      http.get(API.INCIDENT, () =>
        HttpResponse.json({
          ...incidentFixture,
          id: 12345,
        })
      )
    )

    server.use(
      http.get(API.INCIDENT_CONTEXT_REPORTER, ({ request }) => {
        const reqUrl = new URL(request.url)

        const page = reqUrl.searchParams.get('page')
        return HttpResponse.json({
          count: 8,
          results: [{ ...REPORTER_MOCK, id: Number(page) }],
        })
      })
    )

    const { result, waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await waitForNextUpdate()

    expect(result.current.incidents.data?.list[0].id).toEqual(1)
    expect(result.current.currentPage).toEqual(1)

    act(() => {
      result.current.setCurrentPage(2)
    })

    await waitForNextUpdate()

    expect(result.current.incidents.data?.list[0].id).toEqual(2)
    expect(result.current.currentPage).toEqual(2)
  })

  it('returns incident(s) data', async () => {
    const FIRST: Partial<FetchReporterHook> = {
      incident: {
        isLoading: false,
        data: undefined,
        id: undefined,
        canView: undefined,
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
        data: incidentFixture as unknown as Incident,
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

    await waitForNextUpdate()

    // Expect incidents result
    expect(result.current).toEqual(expect.objectContaining(SECOND))

    await waitForNextUpdate()

    // Expect incident request data
    expect(result.current).toEqual(expect.objectContaining(THIRD))
  })

  it('supports selecting an incident', async () => {
    const { result } = renderHook(() => useFetchReporter(INCIDENT_ID), {
      wrapper: Provider,
      initialProps: { store },
    })

    server.use(
      http.get(API.INCIDENT, () =>
        HttpResponse.json({
          ...incidentFixture,
          id: Number(INCIDENT_ID_2),
        })
      )
    )

    act(() => {
      result.current.selectIncident(Number(INCIDENT_ID_2))
    })

    expect(result.current.incident?.id).toBe(Number(INCIDENT_ID_2))
  })

  it('does not fetch incident for which the user has no permission', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await waitForNextUpdate()

    // User has no permission to view incident data for incident with id={INCIDENT_ID_3}
    expect(
      result.current.incidents.data?.list.find(
        ({ id }) => id === Number(INCIDENT_ID_3)
      )?.canView
    ).toBe(false)

    act(() => {
      result.current.selectIncident(Number(INCIDENT_ID_3))
    })

    await waitForNextUpdate()

    expect(result.current.incident.isLoading).toBe(false)
  })

  it('handles errors', async () => {
    server.use(
      http.get(API.INCIDENT_CONTEXT_REPORTER, () =>
        HttpResponse.json('Something went wrong', { status: 500 })
      )
    )

    const { waitForNextUpdate } = renderHook(
      () => useFetchReporter(INCIDENT_ID),
      {
        wrapper: Provider,
        initialProps: { store },
      }
    )

    await waitForNextUpdate()

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
