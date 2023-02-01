// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Area from '..'

describe('<Area />', () => {
  it('should render when supplied props', () => {
    render(withAppContext(<Area id={1} count={200} />))

    expect(
      screen.getByRole('link', { name: '200 meldingen in deze omgeving' })
    ).toBeInTheDocument()
  })

  it('should change the copy when the count is 1', () => {
    render(withAppContext(<Area id={1} count={1} />))

    expect(
      screen.getByRole('link', { name: '1 melding in deze omgeving' })
    ).toBeInTheDocument()
  })

  it('should link to the correct page', () => {
    render(withAppContext(<Area id={321} count={123} />))

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/manage/incident/321/omgeving'
    )
  })
})
