// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import { SortOptions } from '../../../contants'
import IncidentOverviewTitleContainer, { IncidentOverviewTitle } from '../index'

const mockOrderingChangeAction = jest.fn()

describe('containers/IncidentOverviewTitle', () => {
  const filter = { name: '' }

  it('renders a title', () => {
    render(
      withAppContext(
        <IncidentOverviewTitleContainer
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Meldingen' })
    ).toBeInTheDocument()
  })

  it('should provide the IncidentOverviewTitle component with a title', () => {
    const { rerender } = render(
      withAppContext(
        <IncidentOverviewTitle
          filter={filter}
          incidentsCount={null}
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Meldingen' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle
          filter={filter}
          incidentsCount={0}
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Meldingen (0)' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle
          filter={filter}
          incidentsCount={10}
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Meldingen (10)' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle
          filter={{ name: 'Foo bar !!1!' }}
          incidentsCount={null}
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Foo bar !!1!' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle
          filter={{ name: 'Foo bar !!1!' }}
          incidentsCount={9999}
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Foo bar !!1! (9.999)' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle
          filter={{ name: 'Foo bar !!1!', refresh: true }}
          incidentsCount={99}
          showsMap={false}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByRole('img', { name: 'Ververst automatisch' })
    ).toBeInTheDocument()
  })

  it('should provide the IncidentOverviewTitle component with a subtitle', () => {
    const query = 'Foo bar'

    render(
      withAppContext(
        <IncidentOverviewTitle
          filter={filter}
          incidentsCount={null}
          query={query}
          showsMap={false}
          ordering={SortOptions.CREATED_AT_DESC}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.getByText('Zoekresultaten voor "Foo bar"')
    ).toBeInTheDocument()
    expect(screen.getByText('Sorteer op datum (nieuw-oud)')).toBeInTheDocument()
  })

  it('should provide the IncidentOverviewTitle component with sort information', () => {
    render(
      withAppContext(
        <IncidentOverviewTitle
          showsMap={false}
          filter={filter}
          incidentsCount={null}
          ordering={SortOptions.CREATED_AT_ASC}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(screen.getByText('Sorteer op datum (oud-nieuw)')).toBeInTheDocument()

    const resetBtn = screen.getByText('Wis sortering')

    userEvent.click(resetBtn)

    expect(mockOrderingChangeAction).toHaveBeenCalledWith('')
  })

  it('should hide sort information when map is shown', () => {
    render(
      withAppContext(
        <IncidentOverviewTitle
          showsMap={true}
          filter={filter}
          incidentsCount={null}
          ordering={SortOptions.CREATED_AT_ASC}
          orderingChangedAction={mockOrderingChangeAction}
        />
      )
    )

    expect(
      screen.queryByText('Sorteer op datum (nieuw-oud)')
    ).not.toBeInTheDocument()
  })
})
