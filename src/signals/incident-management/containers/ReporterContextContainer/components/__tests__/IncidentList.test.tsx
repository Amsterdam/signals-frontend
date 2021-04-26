// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import IncidentList from '../IncidentList'

describe('IncidentList', () => {
  const list = [
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
    {
      id: 7743,
      created_at: '2021-04-22T15:13:15.254123+02:00',
      category: {
        sub: 'Container papier vol',
        sub_slug: 'container-voor-papier-is-vol',
        departments: 'ASC, AEG',
        main: 'Afval',
        main_slug: 'afval',
      },
      status: {
        state: 'o',
        state_display: 'Afgehandeld',
      },
      feedback: {
        is_satisfied: null,
        submitted_at: null,
      },
      can_view_signal: true,
      has_children: false,
    },
  ]

  it('renders correctly', () => {
    render(
      <IncidentList
        list={list}
        selectedIncidentId={list[1].id}
        setSelectedIncidentId={() => {}}
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
        setSelectedIncidentId={setSelectedIncidentIdSpy}
      />
    )
    userEvent.click(screen.getAllByRole('listitem')[1])

    expect(setSelectedIncidentIdSpy).toHaveBeenCalledWith(newId)
  })
})
