// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import * as reactRouterDom from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import type { Incident as IncidentType } from '../../IncidentDetail/types'

import ReporterContainer from '..'
import { FetchReporterHook } from '../useFetchReporter'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

let mockFetchReporterHook = {} as FetchReporterHook

const INCIDENT_ID = '4440'

jest.mock('../useFetchReporter', () => ({
  useFetchReporter: () => mockFetchReporterHook,
}))

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: '123',
}))

describe('ReporterContainer', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id: INCIDENT_ID,
    }))

    mockFetchReporterHook = {
      incident: {
        isLoading: false,
        data: {
          id: 4440,
          text: 'Incident text',
          reporter: { email: 'example@amsterdam.nl' },
        } as IncidentType,
      },
      currentPage: 0,
      setCurrentPage: jest.fn(),
      selectIncident: jest.fn(),
      incidents: {
        isLoading: false,
        data: {
          count: 1,
          list: [
            {
              id: 4440,
              createdAt: '2021-04-22T15:22:43.882134+02:00',
              category: 'Overig afval',
              status: 'Verzoek tot heropenen',
              feedback: {
                isSatisfied: false,
                submittedAt: '2021-04-22T13:27:12.942554Z',
              },
              hasChildren: false,
            },
          ],
        },
      },
    }
  })

  it('renders loading indicator', () => {
    if (mockFetchReporterHook) {
      mockFetchReporterHook.incident.isLoading = true
      mockFetchReporterHook.incident.data = undefined

      mockFetchReporterHook.incidents.isLoading = true
      mockFetchReporterHook.incidents.data = undefined
    }
    render(withAppContext(<ReporterContainer />))

    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
  })

  it('should render correctly', () => {
    render(withAppContext(<ReporterContainer />))

    expect(screen.getByTestId('reporterContainer')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Terug naar melding' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Meldingen van example@amsterdam.nl (1)',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })
})
