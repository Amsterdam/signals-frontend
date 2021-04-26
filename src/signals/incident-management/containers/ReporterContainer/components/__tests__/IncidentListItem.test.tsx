import React from 'react'

import { screen, render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import IncidentListItem from '../IncidentListItem'

describe('IncidentListItem', () => {
  const incident = {
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
  }

  it('renders a list item', () => {
    render(
      <IncidentListItem
        incident={incident}
        onClick={jest.fn()}
        isSelected={false}
      />
    )

    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(screen.getByText('Niet tevreden')).toBeInTheDocument()
    expect(screen.getByText('7744 Overig afval')).toBeInTheDocument()
    expect(screen.getByText('Verzoek tot heropenen')).toBeInTheDocument()
    expect(screen.getByText('22-04-2021 15:22')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).not.toHaveStyleRule(
      'background-color',
      expect.any(String)
    )
    expect(screen.queryByTestId('parentIcon')).not.toBeInTheDocument()
  })

  it('renders a selected list item', () => {
    render(
      withAppContext(
        <IncidentListItem incident={incident} onClick={jest.fn()} isSelected />
      )
    )

    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveStyleRule(
      'background-color',
      expect.any(String)
    )
  })

  it('renders an icon for main incidents', () => {
    render(
      withAppContext(
        <IncidentListItem
          incident={{ ...incident, has_children: true }}
          onClick={jest.fn()}
          isSelected
        />
      )
    )

    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(screen.getByTestId('parentIcon')).toBeInTheDocument()
  })
})
