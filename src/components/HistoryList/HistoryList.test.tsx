// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import history from 'utils/__tests__/fixtures/history.json'

import HistoryList from '.'

describe('<ChildIncidentHistory />', () => {
  it('renders incident history', () => {
    render(withAppContext(<HistoryList list={history} />))

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('25-03-2020 om 14.07')).toBeInTheDocument()
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

  it('renders emphasis and lists in the description', () => {
    const historyWithDescription = [
      {
        ...history[0],
        description:
          '*Emphasis* **Strong** ***Strong emphasis***\n\n1. Ordered list item 1\n2. Ordered list item 2\n\n- Unordered list item 1\n- Unordered list item 2',
      },
    ]

    render(withAppContext(<HistoryList list={historyWithDescription} />))

    expect(screen.getByText('Emphasis')).toBeInTheDocument()
    expect(screen.getByText('Strong')).toBeInTheDocument()
    expect(screen.getByText('Strong emphasis')).toBeInTheDocument()

    expect(screen.getByText('Ordered list item 1')).toBeInTheDocument()
    expect(screen.getByText('Ordered list item 2')).toBeInTheDocument()

    expect(screen.getByText('Unordered list item 1')).toBeInTheDocument()
    expect(screen.getByText('Unordered list item 2')).toBeInTheDocument()
  })
})
