// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import IncidentList from './IncidentList'
import type { ReporterIncident } from '../types'

describe('IncidentList', () => {
  const list: ReporterIncident[] = [
    {
      id: 7744,
      createdAt: '2021-04-22T15:22:43.882134+02:00',
      category: 'Overig afval',
      status: 'Verzoek tot heropenen',
      feedback: {
        isSatisfied: false,
        submittedAt: '2021-04-22T13:27:12.942554Z',
      },
      hasChildren: false,
      canView: true,
    },
    {
      id: 7743,
      createdAt: '2021-04-22T15:13:15.254123+02:00',
      category: 'Container papier vol',
      status: 'Afgehandeld',
      feedback: {
        isSatisfied: null,
        submittedAt: null,
      },
      hasChildren: false,
      canView: true,
    },
  ]

  it('renders correctly', () => {
    render(
      <IncidentList
        list={list}
        selectedIncidentId={list[1].id}
        selectIncident={() => {}}
      />
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('handles setSelectedIncidentId', () => {
    const setSelectedIncidentIdSpy = jest.fn()
    const oldId = list[0].id
    const newId = list[1].id

    render(
      <IncidentList
        list={list}
        selectedIncidentId={oldId}
        selectIncident={setSelectedIncidentIdSpy}
      />
    )
    userEvent.click(screen.getAllByRole('listitem')[1])

    expect(setSelectedIncidentIdSpy).toHaveBeenCalledWith(newId)
  })
})
