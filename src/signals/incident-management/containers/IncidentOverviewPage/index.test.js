// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { fireEvent, render, act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Enzyme, { mount } from 'enzyme'
import * as reactRouterDom from 'react-router-dom'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import * as constants from 'signals/incident-management/constants'
import { withAppContext, history } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import IncidentOverviewPage, { IncidentOverviewPageContainerComponent } from '.'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('scroll-lock')
jest.mock('signals/incident-management/constants')
jest.mock('signals/incident-management/actions', () => {
  const actual = jest.requireActual('signals/incident-management/actions')
  const {
    PAGE_CHANGED,
    // eslint-disable-next-line
  } = require('signals/incident-management/constants')

  return {
    __esModule: true,
    ...actual,
    pageChanged: jest.fn((page) => ({
      type: PAGE_CHANGED,
      payload: page,
    })),
  }
})

// mocking the return value of selectors for underlying components
jest.mock('models/categories/selectors', () => {
  // eslint-disable-next-line global-require
  const cats = require('utils/__tests__/fixtures/categories_structured.json')
  return {
    __esModule: true,
    ...jest.requireActual('models/categories/selectors'),
    makeSelectStructuredCategories: jest.fn(() => cats),
  }
})

// make sure that JSDOM doesn't trip over unsupported feature
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
})

const generateIncidents = (number = 100) =>
  [...new Array(number).keys()].map((index) => ({
    ...incidentJson,
    id: index + 1,
  }))

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const mockApplyFilterAction = jest.fn()

describe('signals/incident-management/containers/IncidentOverviewPage', () => {
  let props

  beforeEach(() => {
    constants.FILTER_PAGE_SIZE = 50

    props = {
      incidents: {
        count: 0,
        results: [],
        loadingIncidents: true,
      },
      page: 3,
      ordering: '-created_at',
      categories: {},
      orderingChangedAction: jest.fn(),
      pageChangedAction: jest.fn(),
      clearFiltersAction: jest.fn(),
      applyFilterAction: mockApplyFilterAction,
    }
  })

  it('should render a backlink to dashboard, hide filters and call mockApplyFilterAction', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      state: {
        useDashboardFilters: true,
      },
    }))

    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />, {
        stadsdeel: { value: 'O' },
      })
    )

    expect(screen.getByText('Terug naar dashboard')).toBeTruthy()

    expect(mockApplyFilterAction).toBeCalledWith({
      options: { stadsdeel: ['O'] },
    })

    expect(screen.queryByText('Mijn filters')).not.toBeInTheDocument()
  })

  it('should not render a backlink to dashboard, show mijn filters and dont call mockApplyFilterAction', () => {
    mockApplyFilterAction.mockReset()

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      state: null,
    }))

    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />, {})
    )

    expect(screen.queryByText('Terug naar dashboard')).toBe(null)

    expect(mockApplyFilterAction).not.toBeCalledWith({
      options: { stadsdeel: ['O'] },
    })

    expect(screen.getByText('Mijn filters')).toBeInTheDocument()
  })

  it('should not render a backlink to dashboard when there are no valid dashboard filters', () => {
    mockApplyFilterAction.mockReset()

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      state: {
        useDashboardFilters: true,
      },
    }))

    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />, {})
    )
    expect(screen.queryByText('Terug naar dashboard')).not.toBeInTheDocument()

    expect(screen.queryByText('Mijn filters')).toBeInTheDocument()
  })

  it('should keep useDashboardFilters route state when navigating to manage/incidents/kaart', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      state: {
        useDashboardFilters: true,
      },
      location: 'manage/incidents',
    }))

    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />, {
        stadsdeel: { value: 'O' },
      })
    )

    history.push('/manage/incidents', { useDashboardFilters: true })

    act(() => history.push('/manage/incidents/kaart'))

    expect(history.entries.at(-1).state).toEqual({ useDashboardFilters: true })

    act(() => history.push('/manage/standaard/teksten'))

    expect(history.entries.at(-1).state).toEqual({})
  })

  it('should render modal buttons', () => {
    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    )

    expect(screen.getByText('Filter').tagName).toEqual('BUTTON')
    expect(screen.getByText('Mijn filters').tagName).toEqual('BUTTON')
  })

  it('should render a list of incidents', () => {
    const { rerender } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    )

    expect(screen.queryByTestId('loading-indicator')).toBeInTheDocument()
    expect(
      screen.queryByTestId('incident-overview-list-component')
    ).not.toBeInTheDocument()

    const incidents = generateIncidents()

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loadingIncidents: false,
          }}
        />
      )
    )

    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('incident-overview-list-component')
    ).toBeInTheDocument()
  })

  it('should render quick filter links', () => {
    const name = 'foo'
    const applyFilterSpy = jest.fn()
    const filters = [
      {
        id: 1,
        show_on_overview: true,
        name,
      },
    ]

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          applyFilterAction={applyFilterSpy}
          filters={filters}
        />
      )
    )

    userEvent.click(screen.getByRole('button', { name }))

    expect(applyFilterSpy).toHaveBeenCalledWith(
      expect.objectContaining(filters[0])
    )
  })

  it('should render pagination controls', () => {
    constants.FILTER_PAGE_SIZE = 101
    const incidents = generateIncidents()

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loadingIncidents: false,
          }}
        />
      )
    )

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()

    constants.FILTER_PAGE_SIZE = 100

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loadingIncidents: false,
          }}
        />
      )
    )

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()

    constants.FILTER_PAGE_SIZE = 99

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loadingIncidents: false,
          }}
        />
      )
    )

    expect(screen.queryAllByTestId('pagination')).toHaveLength(2)
  })

  it('should show notification when no results can be rendered', () => {
    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    )

    expect(screen.getByText('Geen meldingen')).toBeInTheDocument()
  })

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />))

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props()

    expect(containerProps.activeFilter).not.toBeUndefined()
    expect(containerProps.ordering).not.toBeUndefined()
    expect(containerProps.page).not.toBeUndefined()
  })

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />))

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props()

    expect(containerProps.pageChangedAction).not.toBeUndefined()
    expect(typeof containerProps.pageChangedAction).toEqual('function')

    expect(containerProps.orderingChangedAction).not.toBeUndefined()
    expect(typeof containerProps.orderingChangedAction).toEqual('function')
  })

  it('should set page after navigating with pagination', () => {
    constants.FILTER_PAGE_SIZE = 30

    const incidents = generateIncidents()

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loadingIncidents: false,
          }}
        />
      )
    )

    expect(props.pageChangedAction).not.toHaveBeenCalled()

    const nextPageButton = screen.getAllByRole('button', {
      name: 'Volgende pagina',
    })[0]

    act(() => {
      fireEvent.click(nextPageButton)
    })

    expect(props.pageChangedAction).toHaveBeenCalledWith(props.page + 1)
  })

  it('should render a map', async () => {
    const incidents = generateIncidents()

    const { unmount } = render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loadingIncidents: false,
          }}
        />
      )
    )

    expect(screen.getByTestId('sub-nav')).toBeInTheDocument()

    expect(
      screen.getByTestId('incident-overview-list-component')
    ).toBeInTheDocument()
    expect(screen.queryByTestId('24HourMap')).not.toBeInTheDocument()

    const subNavMapLink = await screen.findByTestId('sub-nav-map-link')

    act(() => {
      fireEvent.click(subNavMapLink)
    })

    const subNavListLink = await screen.findByTestId('sub-nav-list-link')

    expect(
      screen.queryByTestId('incident-overview-list-component')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('24-hour-map')).toBeInTheDocument()

    act(() => {
      fireEvent.click(subNavListLink)
    })

    await screen.findByTestId('sub-nav-map-link')

    expect(
      screen.getByTestId('incident-overview-list-component')
    ).toBeInTheDocument()
    expect(screen.queryByTestId('24-hour-map')).not.toBeInTheDocument()

    unmount()
  })

  describe('filter modal', () => {
    it('opens filter modal', () => {
      render(withAppContext(<IncidentOverviewPage />))

      expect(screen.queryByTestId('filter-modal')).toBeNull()

      fireEvent(
        screen.getByTestId('filter-modal-btn'),
        new MouseEvent('click', { bubbles: true })
      )

      expect(screen.queryByTestId('filter-modal')).not.toBeNull()
    })

    it('opens my filters modal', () => {
      render(withAppContext(<IncidentOverviewPage />))

      expect(screen.queryByTestId('my-filters-modal')).toBeNull()

      fireEvent(
        screen.getByTestId('my-filters-modal-btn'),
        new MouseEvent('click', { bubbles: true })
      )

      expect(screen.queryByTestId('my-filters-modal')).not.toBeNull()
    })

    it('closes modal on ESC', () => {
      render(withAppContext(<IncidentOverviewPage />))

      fireEvent(
        screen.getByTestId('filter-modal-btn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      )

      expect(screen.queryByTestId('filter-modal')).not.toBeNull()

      fireEvent.keyDown(global.document, { key: 'Esc', keyCode: 27 })

      expect(screen.queryByTestId('filter-modal')).toBeNull()
    })

    it('closes modal by means of close button', () => {
      render(withAppContext(<IncidentOverviewPage />))

      fireEvent(
        screen.getByTestId('filter-modal-btn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      )

      expect(screen.queryByTestId('filter-modal')).not.toBeNull()

      fireEvent(
        screen.getByTestId('close-btn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      )

      expect(screen.queryByTestId('filter-modal')).toBeNull()
    })

    it('should disable page scroll', () => {
      render(withAppContext(<IncidentOverviewPage />))

      fireEvent(
        screen.getByTestId('filter-modal-btn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      )

      expect(disablePageScroll).toHaveBeenCalled()
    })

    it('should enable page scroll', () => {
      render(withAppContext(<IncidentOverviewPage />))

      fireEvent(
        screen.getByTestId('filter-modal-btn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      )

      fireEvent(
        screen.getByTestId('close-btn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      )

      expect(enablePageScroll).toHaveBeenCalled()
    })
  })
})
