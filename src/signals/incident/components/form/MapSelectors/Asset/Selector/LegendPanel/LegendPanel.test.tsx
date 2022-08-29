// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import 'jest-styled-components'

import { withAppContext } from 'test/utils'

import LegendPanel from './LegendPanel'
import type { LegendPanelProps } from './LegendPanel'

describe('LegendPanel', () => {
  const props: LegendPanelProps = {
    onClose: () => {},
    items: [
      {
        iconUrl: 'url',
        id: 'id',
        label: 'label',
      },
    ],
    buttonRef: jest.fn(),
  }

  it('render correctly', () => {
    render(withAppContext(<LegendPanel {...props} />))

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(
      screen.getByTestId(`legendPanelListItem-${props.items[0].id}`)
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBe(props.items?.length)
  })

  it('renders with empty items', () => {
    render(
      withAppContext(
        <LegendPanel
          items={[]}
          onClose={props.onClose}
          buttonRef={props.buttonRef}
        />
      )
    )

    expect(screen.queryAllByRole('listitem').length).toBe(0)
  })

  it('renders visible panel', () => {
    const { rerender } = render(withAppContext(<LegendPanel {...props} />))

    expect(screen.getByTestId('legendPanel')).toHaveStyleRule(
      'transform',
      'translate3d( 0,200%,0 )',
      { media: 'only screen and (max-width:767px)' }
    )

    expect(screen.getByTestId('legendPanel')).toHaveStyleRule(
      'transform',
      'translate3d( -200%,0,0 )',
      { media: 'only screen and (min-width:768px)' }
    )

    rerender(withAppContext(<LegendPanel {...props} slide="in" />))

    expect(screen.getByTestId('legendPanel')).toHaveStyleRule(
      'transform',
      'translate3d( 0,0,0 )',
      { media: 'only screen and (max-width:767px)' }
    )

    expect(screen.getByTestId('legendPanel')).toHaveStyleRule(
      'transform',
      'translate3d( 0,0,0 )',
      { media: 'only screen and (min-width:768px)' }
    )
  })
})
