// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import history from 'utils/__tests__/fixtures/history.json'

import HistoryList from '..'

describe('<ChildIncidentHistory />', () => {
  it('renders incident history', () => {
    render(withAppContext(<HistoryList list={history} />))

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('25-03-2020 om 14:07')).toBeInTheDocument()
    expect(screen.getByText(history[0].who)).toBeInTheDocument()
    expect(screen.getByText(history[0].action)).toBeInTheDocument()
  })

  it('renders description', () => {
    const historyWithDescription = [
      { ...history[0], description: 'mock description' },
    ]

    render(withAppContext(<HistoryList list={historyWithDescription} />))

    expect(screen.getByText('mock description')).toBeInTheDocument()
  })

  it('converts Markdown to HTML', () => {
    const link1 = 'https://www.amsterdam.nl'

    const { rerender } = render(
      withAppContext(
        <HistoryList
          list={[
            { ...history[0], action: `mock [link text](${link1}) description` },
          ]}
        />
      )
    )

    expect(screen.getByRole('link')).toHaveAttribute('href', link1)

    const link2 = 'https://www.amsterdam.nl/contact'

    rerender(
      withAppContext(
        <HistoryList
          list={[
            {
              ...history[0],
              description: `mock [link text](${link2}) description`,
            },
          ]}
        />
      )
    )

    expect(screen.getByRole('link')).toHaveAttribute('href', link2)
  })

  it('does not convert unallowed Markdown', () => {
    render(
      withAppContext(
        <HistoryList list={[{ ...history[0], action: '## Here is an h2' }]} />
      )
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
