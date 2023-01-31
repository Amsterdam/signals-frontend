// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Reporter from '..'
import type { ReporterProps } from '../Reporter'

describe('<Reporter />', () => {
  it('should render with one incident', () => {
    const props: ReporterProps = {
      id: 1234,
      reporter: {
        negative_count: 0,
        open_count: 1,
        positive_count: 0,
        signal_count: 1,
      },
    }
    render(withAppContext(<Reporter {...props} />))

    expect(screen.getByRole('link', { name: '1 melding' })).toBeInTheDocument()
    expect(
      screen.getByText('0x niet tevreden / 1x openstaand')
    ).toBeInTheDocument()
  })

  it('should render with many incidents', () => {
    const props: ReporterProps = {
      id: 1234,
      reporter: {
        negative_count: 1000,
        open_count: 2000,
        positive_count: 3000,
        signal_count: 4000,
      },
    }
    render(withAppContext(<Reporter {...props} />))

    expect(
      screen.getByRole('link', { name: '4000 meldingen' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('1000x niet tevreden / 2000x openstaand')
    ).toBeInTheDocument()
  })
})
