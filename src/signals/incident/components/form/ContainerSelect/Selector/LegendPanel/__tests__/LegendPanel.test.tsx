// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import React from 'react'
import { withAppContext } from 'test/utils'

import LegendPanel from '../LegendPanel'
import type { LegendPanelProps } from '../LegendPanel'

describe('LegendPanel', () => {
  const props: LegendPanelProps = {
    onClose: () => {},
    variant: 'drawer',
    items: [
      {
        iconUrl: 'url',
        id: 'id',
        label: 'label',
      },
    ],
  }
  it('should render', () => {
    render(withAppContext(<LegendPanel {...props} />))

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(
      screen.getByTestId(`legendPanelListItem-${props.items[0].id}`)
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBe(props.items?.length)
  })

  it('should render with empty items', () => {
    render(
      withAppContext(
        <LegendPanel
          items={[]}
          onClose={props.onClose}
          variant={props.variant}
        />
      )
    )

    expect(screen.queryAllByRole('listitem').length).toBe(0)
  })
})
