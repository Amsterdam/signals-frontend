// /* SPDX-License-Identifier: MPL-2.0 */
// /* Copyright (C) 2022 Gemeente Amsterdam */
import { screen, render } from '@testing-library/react'
import * as reactResponsive from 'react-responsive'

import { Header } from './Header'

jest.mock('react-responsive')

const resizeWindow = (x: number, y: number) => {
  window.innerWidth = x
  window.innerHeight = y
  window.dispatchEvent(new Event('resize'))
}

describe('Header', () => {
  beforeEach(() => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(false)
  })

  it('should render component correctly', () => {
    render(<Header />)

    expect(screen.getByText('Meldingenkaart')).toBeInTheDocument()
    expect(screen.getByText('Doe een melding')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'menu' })
    ).not.toBeInTheDocument()
  })

  it('should render burger menu correctly', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)
    resizeWindow(400, 1200)

    render(<Header />)

    expect(screen.getByText('Meldingenkaart')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })
})
