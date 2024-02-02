// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { mock } from 'types/incident'

import DateTime from '.'

const today = new Date()
today.setHours(12)
today.setMinutes(0)

describe('DateTime', () => {
  it('renders an empty element', () => {
    const { rerender } = render(<DateTime value={today.getTime()} />)

    expect(screen.getByTestId('preview-date-time')).toBeEmptyDOMElement()

    rerender(<DateTime value={undefined} />)

    expect(screen.getByTestId('preview-date-time')).toBeEmptyDOMElement()
  })

  it('renders Nu', () => {
    render(<DateTime value={'now'} />)

    expect(screen.getByTestId('preview-date-time')).toHaveTextContent('Nu')
  })

  it("renders Vandaag for today's date", () => {
    const somewhereToday = new Date(today)
    somewhereToday.setHours(15)
    somewhereToday.setMinutes(30)

    render(<DateTime value={somewhereToday.getTime()} incident={mock} />)

    expect(screen.getByText('Vandaag, 15:30')).toBeInTheDocument()
  })

  it('renders date and time', () => {
    const someRandomDate = new Date('2022-02-07')
    someRandomDate.setHours(12)
    someRandomDate.setMinutes(34)

    render(<DateTime value={someRandomDate.getTime()} incident={mock} />)

    expect(screen.getByText('Maandag 7 februari, 12:34')).toBeInTheDocument()
  })
})
