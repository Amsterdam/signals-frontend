// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import IncidentOverviewTitleContainer, { IncidentOverviewTitle } from '..'

describe('containers/IncidentOverviewTitle', () => {
  const filter = { name: '' }

  it('renders a title', () => {
    render(withAppContext(<IncidentOverviewTitleContainer />))

    expect(
      screen.getByRole('heading', { name: 'Meldingen' })
    ).toBeInTheDocument()
  })

  it('should provide the IncidentOverviewTitle component with a title', () => {
    const { rerender } = render(
      withAppContext(
        <IncidentOverviewTitle filter={filter} incidentsCount={null} />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Meldingen' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle filter={filter} incidentsCount={0} />
      )
    )

    expect(
      screen.getByRole('heading', { name: 'Meldingen (0)' })
    ).toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentOverviewTitle filter={filter} incidentsCount={10} />
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
        />
      )
    )

    expect(
      screen.getByText('Zoekresultaten voor "Foo bar"')
    ).toBeInTheDocument()
  })
})
