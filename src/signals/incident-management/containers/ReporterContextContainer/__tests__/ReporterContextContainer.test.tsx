import React from 'react'
import * as reactRouterDom from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import ReporterContextContainer from '..'
import { ReporterContextHook } from '../hooks'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

let mockReporterContextHook = {} as ReporterContextHook

jest.mock('../hooks', () => ({
  useReporterContext: () => mockReporterContextHook,
}))

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: '123',
}))

describe('ReporterContextContainer', () => {
  beforeEach(() => {
    mockReporterContextHook = {
      selectedIncident: {
        id: 123,
        reporter: {
          email: '',
        },
        text: 'Mock text',
      },
      selectedIncidentId: 123,
      setSelectedIncidentId: jest.fn(),
      isLoading: false,
      reporter: {
        originalIncidentId: '987',
        email: 'example@amsterdam.nl',
        incidents: {
          results: [
            {
              id: 7744,
              created_at: '2021-04-22T15:22:43.882134+02:00',
              category: {
                sub: 'Overig afval',
                sub_slug: 'overig-afval',
                departments: 'ASC, AEG, STW',
                main: 'Afval',
                main_slug: 'afval',
              },
              status: {
                state: 'reopen requested',
                state_display: 'Verzoek tot heropenen',
              },
              feedback: {
                is_satisfied: false,
                submitted_at: '2021-04-22T13:27:12.942554Z',
              },
              can_view_signal: true,
              has_children: false,
            },
          ],
          count: 10,
          _links: {
            next: 'foo',
            previous: 'bar',
            self: 'baz',
          },
        },
      },
    }
  })

  it('renders loading indicator', () => {
    mockReporterContextHook.isLoading = true
    render(withAppContext(<ReporterContextContainer />))

    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
  })

  it('should render correctly', () => {
    render(withAppContext(<ReporterContextContainer />))

    expect(screen.getByTestId('reporterContextContainer')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Terug naar melding' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Meldingen van example@amsterdam.nl (10)',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })
})
