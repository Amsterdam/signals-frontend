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

import { IncidentList } from 'types/api/incident-list'
import { StatusCode } from 'signals/incident-management/definitions/types'
import IncidentManagementContext from '../../../../context'
import List from '.'

jest.mock('shared/services/configuration/configuration')

const withContext = (Component: JSX.Element) =>
  withAppContext(
    <IncidentManagementContext.Provider value={{ districts }}>
      {Component}
    </IncidentManagementContext.Provider>
  )

const props = {
  incidents: incidents as IncidentList,
  priority: priorityList,
  status: statusList,
  stadsdeel: stadsdeelList,
  onChangeOrdering: jest.fn(),
  sort: '-created_at',
}

describe('List', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
    props.onChangeOrdering.mockReset()
  })

  it('should render correctly', () => {
    render(withContext(<List {...props} />))

    const columnHeaders = [
      '', // Split incident column
      '', // Urgency column
      'Id',
      'Dag',
      'Datum en tijd',
      'Stadsdeel',
      'Subcategorie',
      'Status',
      'Adres',
    ]

    screen.getAllByRole('columnheader').forEach((header, index) => {
      expect(header).toHaveTextContent(columnHeaders[index])
    })

    expect(
      screen.getByRole('row', {
        name: '1668 - 03-12-2018 10:41 Centrum Wegsleep Afgehandeld Staalstraat 3B 1011JJ Amsterdam',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('row', {
        name: '1667 1019 29-11-2018 23:03 Zuid Dode dieren Gemeld Raamgracht 45 1011KJ Amsterdam',
      })
    ).toBeInTheDocument()
  })

  it('should render nowrap correctly', () => {
    const whiteSpace = 'nowrap'
    const { container } = render(withContext(<List {...props} />))

    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(2)')
    ).not.toHaveStyleRule('white-space', whiteSpace)
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(3)')
    ).not.toHaveStyleRule('white-space', whiteSpace)
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(4)')
    ).not.toHaveStyleRule('white-space', whiteSpace)
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(5)')
    ).toHaveStyleRule('white-space', whiteSpace)
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(6)')
    ).not.toHaveStyleRule('white-space', whiteSpace)
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

    const { container } = render(withContext(<List {...props} />))

    expect(container.querySelector('tr th:nth-child(6)')).toHaveTextContent(
      /^District/
    )
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(6)')
    ).toHaveTextContent(/^North/)
    expect(
      container.querySelector('tr:nth-child(2) td:nth-child(6)')
    ).toHaveTextContent(/^South/)
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
      const incidentWithStatus = (state: StatusCode, id: number) => ({
        ...props.incidents[0],
        status: {
          ...props.incidents[0].status,
          state,
        },
        id,
      })

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

      const numCells = screen.getAllByTestId('incidentDaysOpen').length

      expect(numCells).toEqual(listProps.incidents.length)

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
