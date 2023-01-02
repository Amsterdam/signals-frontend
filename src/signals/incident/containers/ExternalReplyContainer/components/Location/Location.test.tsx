// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import Location from '.'

describe('Location', () => {
  const address = {
    postcode: '1234AB',
    huisletter: null,
    huisnummer: '1',
    woonplaats: 'Amsterdam',
    openbare_ruimte: 'straat',
    huisnummer_toevoeging: 'H',
  }
  const location = {
    address,
    geometrie: {
      coordinates: [1, 2] as [number, number],
      type: 'Point',
    },
    stadsdeel: 'Centrum',
  }

  it('renders a thumbnail with address text', () => {
    render(withAppContext(<Location onClick={jest.fn()} location={location} />))

    // Check for map thumbnail image
    expect(screen.getAllByRole('img')[0]).toHaveClass('leaflet-tile')

    expect(screen.getByText(location.stadsdeel)).toBeInTheDocument()
    expect(
      screen.getByText(
        `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}-${address.huisnummer_toevoeging}`
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(`${address.postcode} ${address.woonplaats}`)
    ).toBeInTheDocument()
  })

  it('renders fallback message when address is not provided (null)', () => {
    const locationWithoutAddress = {
      ...location,
      address: null,
    }

    render(
      withAppContext(
        <Location location={locationWithoutAddress} onClick={jest.fn()} />
      )
    )

    expect(
      screen.getByText('Locatie is gepind op de kaart')
    ).toBeInTheDocument()
  })

  it('renders fallback message when address is not provided (empty object)', () => {
    const locationWithoutAddress = {
      ...location,
      address: {},
    }

    render(
      withAppContext(
        <Location location={locationWithoutAddress} onClick={jest.fn()} />
      )
    )

    expect(
      screen.getByText('Locatie is gepind op de kaart')
    ).toBeInTheDocument()
  })

  it('handles clicking on the map thumbnail', () => {
    const clickSpy = jest.fn()
    render(withAppContext(<Location onClick={clickSpy} location={location} />))

    userEvent.click(screen.getAllByRole('img')[0])

    expect(clickSpy).toHaveBeenCalled()
  })

  it('handles enter keypress when map thumbnail is focused', () => {
    const clickSpy = jest.fn()
    render(withAppContext(<Location onClick={clickSpy} location={location} />))

    userEvent.tab()
    expect(screen.getByTestId('map-thumbnail-button')).toHaveFocus()
    userEvent.keyboard('{enter}')

    expect(clickSpy).toHaveBeenCalled()
  })
})
