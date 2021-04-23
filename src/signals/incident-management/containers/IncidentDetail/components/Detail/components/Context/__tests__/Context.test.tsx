// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import React from 'react'
import { withAppContext } from 'test/utils'
import Context from '..'

import type { ContextProps } from '../Context'

describe('<Context />', () => {
  it('should render with one incident', () => {
    const props: ContextProps = {
      id: 1234,
      context: {
        reporter: {
          negative_count: 0,
          open_count: 1,
          positive_count: 0,
          signal_count: 1,
        },
      },
    }
    render(withAppContext(<Context {...props} />))

    expect(screen.getByRole('link', { name: '1 melding' })).toBeInTheDocument()
    expect(
      screen.getByText('0x niet tevreden / 1x openstaand')
    ).toBeInTheDocument()
  })

  it('should render with many incidents', () => {
    const props: ContextProps = {
      id: 1234,
      context: {
        reporter: {
          negative_count: 1000,
          open_count: 2000,
          positive_count: 3000,
          signal_count: 4000,
        },
      },
    }
    render(withAppContext(<Context {...props} />))

    expect(
      screen.getByRole('link', { name: '4000 meldingen' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('1000x niet tevreden / 2000x openstaand')
    ).toBeInTheDocument()
  })
})
