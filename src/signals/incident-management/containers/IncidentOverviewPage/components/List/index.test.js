// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configuration from 'shared/services/configuration/configuration'
import {
  priorityList,
  statusList,
  stadsdeelList,
} from 'signals/incident-management/definitions'
import { withAppContext } from 'test/utils'
import 'jest-styled-components'

import districts from 'utils/__tests__/fixtures/districts.json'
import incidents from 'utils/__tests__/fixtures/incidents.json'
import users from 'utils/__tests__/fixtures/users.json'

import IncidentManagementContext from '../../../../context'
import List from '.'

jest.mock('shared/services/configuration/configuration')

const withContext = (Component) =>
  withAppContext(
    <IncidentManagementContext.Provider
      value={{ districts, users: users.results }}
    >
      {Component}
    </IncidentManagementContext.Provider>
  )

const props = {
  incidents,
  priority: priorityList,
  status: statusList,
  stadsdeel: stadsdeelList,
  onChangeOrdering: jest.fn(),
}

describe('List', () => {
  beforeEach(() => {})

  afterEach(() => {
    configuration.__reset()
    props.onChangeOrdering.mockReset()
  })

  it('should render correctly', () => {
    render(withContext(<List {...props} />))

    const columnHeaders = [
      /^$/,
      /^Urgentie$/,
      /^Id$/,
      /^Dag$/,
      /^Datum en tijd$/,
      /^Subcategorie$/,
      /^Status$/,
      /^Stadsdeel$/,
      /^Adres$/,
    ]

    // Check presence of individual values
    columnHeaders.forEach((name) => {
      expect(screen.getByRole('columnheader', { name })).toBeInTheDocument()
    })

    const cells = [
      'Normaal',
      /^03-12-2018 10:41$/,
      '-',
      'Centrum',
      'Staalstraat 3B, 1011JJ Amsterdam',
      `${incidents[0].id}`,
      incidents[0].category.sub,
      incidents[0].status.state_display,
      incidents[0].category.sub,
    ]

    cells.forEach((name) => {
      expect(screen.getAllByRole('cell', { name })).toBeDefined()
    })

    // Check order of values
    expect(
      screen.getByRole('row', {
        name: 'Urgentie Id Dag Datum en tijd Subcategorie Status Stadsdeel Adres',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('row', {
        name: 'Normaal 1668 - 03-12-2018 10:41 Wegsleep Afgehandeld Centrum Staalstraat 3B, 1011JJ Amsterdam',
      })
    ).toBeInTheDocument()
  })

  it('should render correctly when loading', () => {
    const opacity = '0.3'
    const { rerender, getByTestId } = render(withContext(<List {...props} />))
    expect(getByTestId('incidentOverviewListComponent')).not.toHaveStyleRule(
      'opacity',
      opacity
    )

    rerender(withContext(<List {...{ ...props, isLoading: true }} />))
    expect(getByTestId('incidentOverviewListComponent')).toHaveStyleRule(
      'opacity',
      opacity
    )
  })

  it('should render correctly with fetchDistrictsFromBackend', () => {
    configuration.featureFlags.fetchDistrictsFromBackend = true
    configuration.language.district = 'District'

    render(withContext(<List {...props} />))

    expect(
      screen.getByRole('columnheader', { name: 'District' })
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'North' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'South' })).toBeInTheDocument()
  })

  it('should render correctly with assignSignalToEmployee', () => {
    configuration.featureFlags.assignSignalToEmployee = true

    render(withContext(<List {...props} />))
    const ROW_LENGTH = screen.getAllByRole('columnheader').length
    const ASSIGNED_SIGNAL_COL_INDEX = 9

    expect(
      screen.getAllByRole('columnheader')[ASSIGNED_SIGNAL_COL_INDEX]
    ).toHaveTextContent('Toegewezen aan')

    expect(
      screen.getAllByRole('cell')[ASSIGNED_SIGNAL_COL_INDEX]
    ).toHaveTextContent(users.results[0].username)

    expect(
      screen.getAllByRole('cell')[ASSIGNED_SIGNAL_COL_INDEX + ROW_LENGTH]
    ).toHaveTextContent('')
  })

  describe('events', () => {
    it('should sort asc the incidents when the header is clicked', () => {
      render(withContext(<List {...props} sort="-created_at" />))

      expect(props.onChangeOrdering).not.toHaveBeenCalled()

      userEvent.click(
        screen.getByRole('columnheader', { name: 'Datum en tijd' })
      )

      expect(props.onChangeOrdering).toHaveBeenCalledWith('created_at')
    })

    it('should sort desc the incidents when the header is clicked', () => {
      render(withContext(<List {...props} sort="created_at" />))

      expect(props.onChangeOrdering).not.toHaveBeenCalled()

      userEvent.click(
        screen.getByRole('columnheader', { name: 'Datum en tijd' })
      )

      expect(props.onChangeOrdering).toHaveBeenCalledWith('-created_at')
    })

    it('should not show days open for specific statuses', () => {
      const incidentList = [...props.incidents]

      const incidentWithStatusA = { ...incidentList[0], status: { state: 'a' } }
      incidentWithStatusA.id = incidentList[0].id + 1

      incidentList.push(incidentWithStatusA)

      const incidentWithStatusS = { ...incidentList[0], status: { state: 's' } }
      incidentWithStatusS.id = incidentList[0].id + 2

      incidentList.push(incidentWithStatusS)

      const incidentWithStatusReopenRequested = {
        ...incidentList[0],
        status: { state: 'reopen requested' },
      }
      incidentWithStatusReopenRequested.id = incidentList[0].id + 3

      incidentList.push(incidentWithStatusReopenRequested)

      const incidentWithStatusB = { ...incidentList[0], status: { state: 'b' } }
      incidentWithStatusB.id = incidentList[0].id + 4

      incidentList.push(incidentWithStatusB)

      const listProps = { ...props }
      listProps.incidents = incidentList

      render(withContext(<List {...listProps} />))

      const numCells = screen.getAllByTestId('incidentDaysOpen').length

      expect(numCells).toEqual(incidentList.length)

      const elementsWithTextContent = [
        ...screen.getAllByTestId('incidentDaysOpen'),
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

      expect(screen.queryAllByRole('img').length).toEqual(parentsCount)
      expect(screen.queryByRole('img')).toHaveAttribute(
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

      expect(screen.queryAllByRole('img').length).toEqual(childCount)
      expect(screen.queryByRole('img')).toHaveAttribute(
        'aria-label',
        'Deelmelding'
      )
    })
  })
})
