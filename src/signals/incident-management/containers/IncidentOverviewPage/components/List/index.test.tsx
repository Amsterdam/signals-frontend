// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'
import {
  priorityList,
  stadsdeelList,
  statusList,
} from 'signals/incident-management/definitions'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import { withAppContext } from 'test/utils'
import 'jest-styled-components'
import type { IncidentList, IncidentListItem } from 'types/api/incident-list'
import { StatusCode } from 'types/status-code'
import districts from 'utils/__tests__/fixtures/districts.json'
import incidents from 'utils/__tests__/fixtures/incidents.json'
import users from 'utils/__tests__/fixtures/users.json'

import List, { getDaysOpen } from '.'
import { IncidentManagementContext } from '../../../../context'
import { SortOptions } from '../../contants'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))
const navigateSpy = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateSpy)

jest.mock('shared/services/configuration/configuration')

const mockProviderValue = {
  districts,
  standardTexts: {
    page: 1,
    setPage: jest.fn(),
    statusFilter: null,
    setStatusFilter: jest.fn(),
    activeFilter: null,
    setActiveFilter: jest.fn(),
    searchQuery: '',
    setSearchQuery: jest.fn(),
  },
  referrer: `/manage/incident/${incidents[0]}`,
}

const withContext = (Component: JSX.Element) =>
  withAppContext(
    <IncidentManagementContext.Provider value={mockProviderValue}>
      {Component}
    </IncidentManagementContext.Provider>
  )

const orderingChangedActionMock = jest.fn()

const props = {
  incidents: incidents as unknown as IncidentList,
  priority: priorityList,
  status: statusList,
  stadsdeel: stadsdeelList,
  sort: '-created_at',
  orderingChangedAction: orderingChangedActionMock,
}

describe('List', () => {
  beforeEach(() => {
    orderingChangedActionMock.mockClear()
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  it('should render column headers correctly', () => {
    render(withContext(<List {...props} />))

    const expectedHeaders = [
      '',
      'Urgentie',
      'Id',
      'Dag',
      'Datum',
      'Subcategorie',
      'Status',
      'Stadsdeel',
      'Adres',
    ]

    const headers = screen.getAllByRole('columnheader')

    headers &&
      headers.forEach((header, index) => {
        expect(header).toHaveTextContent(expectedHeaders[index])
      })
  })

  it('should render rows correctly', () => {
    render(withContext(<List {...props} />))

    const [INCIDENT_1, INCIDENT_2] = incidents

    const expectedRows = [
      [
        '',
        '',
        `${INCIDENT_1.id}`,
        '-',
        '03-12-2018 10.41',
        INCIDENT_1.category.sub,
        INCIDENT_1.status.state_display,
        'Centrum',
        formatAddress(INCIDENT_1.location.address),
      ],
      [
        '',
        '',
        `${INCIDENT_2.id}`,
        `${getDaysOpen(INCIDENT_2 as unknown as IncidentListItem)}`,
        '29-11-2018 23.03',
        INCIDENT_2.category.sub,
        INCIDENT_2.status.state_display,
        'Zuid',
        formatAddress(INCIDENT_2.location.address),
      ],
    ]

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_columnheaders, ...rows] = screen.getAllByRole('row')
    expect(rows).toHaveLength(expectedRows.length)

    rows.forEach((row, rowIndex) => {
      within(row)
        .getAllByRole('cell')
        .forEach((cell, index) => {
          expect(cell).toHaveTextContent(expectedRows[rowIndex][index])
        })
    })
  })

  it('should handle invalid dates correctly', () => {
    const VALID_DATE = '29-11-2018 23.03'
    const FALLBACK_DATE = '-'

    const incident = incidents[1] as unknown as IncidentListItem
    const incidentWithInvalidDate = { ...incident, created_at: 'foo' }

    const { rerender } = render(
      withContext(<List {...props} incidents={[incident]} />)
    )

    expect(screen.getByRole('cell', { name: VALID_DATE })).toBeInTheDocument()
    expect(
      screen.queryByRole('cell', { name: FALLBACK_DATE })
    ).not.toBeInTheDocument()

    rerender(
      withContext(<List {...props} incidents={[incidentWithInvalidDate]} />)
    )

    expect(
      screen.queryByRole('cell', { name: VALID_DATE })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('cell', { name: FALLBACK_DATE })
    ).toBeInTheDocument()
  })

  it('should render correctly when loading', () => {
    const opacity = '0.3'
    const { rerender, getByTestId } = render(withContext(<List {...props} />))
    expect(getByTestId('incident-overview-list-component')).not.toHaveStyleRule(
      'opacity',
      opacity
    )

    rerender(withContext(<List {...{ ...props, isLoading: true }} />))
    expect(getByTestId('incident-overview-list-component')).toHaveStyleRule(
      'opacity',
      opacity
    )
  })

  it('should render correctly with fetchDistrictsFromBackend', () => {
    const DISTRICT = 'District'
    const DISTRICT_INDEX = 7

    configuration.featureFlags.fetchDistrictsFromBackend = true
    configuration.language.district = DISTRICT

    render(withContext(<List {...props} />))

    const [headers, row1, row2] = screen.getAllByRole('row')

    expect(
      within(headers).getAllByRole('columnheader')[DISTRICT_INDEX]
    ).toHaveTextContent(DISTRICT)

    expect(within(row1).getAllByRole('cell')[DISTRICT_INDEX]).toHaveTextContent(
      'North'
    )
    expect(within(row2).getAllByRole('cell')[DISTRICT_INDEX]).toHaveTextContent(
      'South'
    )
  })

  it('should render correctly with assignSignalToEmployee', () => {
    configuration.featureFlags.assignSignalToEmployee = true

    const { container } = render(withContext(<List {...props} />))

    expect(container.querySelector('tr th:nth-child(10)')).toHaveTextContent(
      'Toegewezen aan'
    )
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(10)')
    ).toHaveTextContent(users.results[0].username)
    expect(
      container.querySelector('tr:nth-child(2) td:nth-child(10)')
    ).toHaveTextContent(/^$/)
  })

  describe('events', () => {
    it('should not show days open for specific statuses', () => {
      const incidentWithStatus = (state: StatusCode, id: number) =>
        ({
          ...props.incidents[0],
          status: {
            ...props.incidents[0].status,
            state,
          },
          id,
        } as IncidentListItem)

      const listProps = {
        ...props,
        incidents: [
          ...props.incidents,
          incidentWithStatus(StatusCode.Geannuleerd, 1),
          incidentWithStatus(StatusCode.Gesplitst, 2),
          incidentWithStatus(StatusCode.ReactieGevraagd, 3),
          incidentWithStatus(StatusCode.Behandeling, 4),
        ],
      }

      render(withContext(<List {...listProps} />))

      const numCells = screen.getAllByTestId('incident-days-open').length

      expect(numCells).toEqual(listProps.incidents.length)

      const elementsWithTextContent = [
        ...screen.getAllByTestId('incident-days-open'),
      ].filter((element) => element.textContent !== '-')

      expect(elementsWithTextContent).toHaveLength(2)
    })

    it('should render an icon for each parent incident', () => {
      const incidentWithChildren = { ...props.incidents[0], has_children: true }
      const incidentList = [incidentWithChildren, ...props.incidents.slice(1)]
      const parentsCount = incidentList.filter(
        (incident) => incident.has_children
      ).length

      render(withContext(<List {...props} incidents={incidentList} />))

      expect(screen.queryAllByTestId('parent-icon').length).toEqual(
        parentsCount
      )
      expect(screen.queryByTestId('parent-icon')).toHaveAttribute(
        'aria-label',
        'Hoofdmelding'
      )
    })

    it('should render an icon for each child incident', () => {
      const incidentWithChildren = { ...props.incidents[0], has_parent: true }
      const incidentList = [incidentWithChildren, ...props.incidents.slice(1)]
      const childCount = incidentList.filter(
        (incident) => incident.has_parent
      ).length

      render(withContext(<List {...props} incidents={incidentList} />))

      expect(screen.queryAllByTestId('child-icon').length).toEqual(childCount)
      expect(screen.queryByTestId('child-icon')).toHaveAttribute(
        'aria-label',
        'Deelmelding'
      )
    })
  })

  it('should tab through rows', () => {
    render(withContext(<List {...props} />))

    expect(document.body).toHaveFocus()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_columnheaders, ...rows] = screen.getAllByRole('row')

    rows.forEach((row) => {
      userEvent.tab()
      expect(row).toHaveFocus()
    })
  })

  it('should navigate to incident when pressing enter on a focused row', () => {
    render(withContext(<List {...props} />))
    const row = screen.getAllByRole('row')[1]

    row.focus()
    userEvent.type(row, '{enter}')

    expect(navigateSpy).toHaveBeenCalledWith(
      `../${INCIDENT_URL}/${props.incidents[0].id}`
    )
  })

  it('should sort by clicking on the column header', () => {
    render(withContext(<List {...props} />))

    userEvent.click(screen.getByRole('columnheader', { name: 'Datum' }))

    expect(orderingChangedActionMock).toHaveBeenCalledWith('-created_at')

    orderingChangedActionMock.mockClear()

    userEvent.click(screen.getByRole('columnheader', { name: 'Subcategorie' }))

    expect(orderingChangedActionMock).toHaveBeenCalledWith('sub_category')
  })

  it('should sort by clicking on the column header and pick the opposite', () => {
    render(
      withContext(<List {...props} ordering={SortOptions.CREATED_AT_ASC} />)
    )

    userEvent.click(screen.getByRole('columnheader', { name: 'Datum' }))

    expect(orderingChangedActionMock).toHaveBeenCalledWith('-created_at')
  })

  it('should sort by clicking on the column header and pick the opposite reversed', () => {
    render(
      withContext(<List {...props} ordering={SortOptions.CREATED_AT_DESC} />)
    )

    userEvent.click(screen.getByRole('columnheader', { name: 'Datum' }))

    expect(orderingChangedActionMock).toHaveBeenCalledWith('created_at')
  })

  it('should not sort when sorting is disabled except date', () => {
    render(withContext(<List {...props} sortingDisabled={true} />))

    userEvent.click(screen.getByRole('columnheader', { name: 'Urgentie' }))
    userEvent.click(screen.getByRole('columnheader', { name: 'Id' }))
    userEvent.click(screen.getByRole('columnheader', { name: 'Subcategorie' }))
    userEvent.click(screen.getByRole('columnheader', { name: 'Status' }))
    userEvent.click(screen.getByRole('columnheader', { name: 'Stadsdeel' }))
    userEvent.click(screen.getByRole('columnheader', { name: 'Adres' }))

    expect(orderingChangedActionMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('columnheader', { name: 'Datum' }))

    expect(orderingChangedActionMock).toHaveBeenCalledTimes(1)
  })
})
