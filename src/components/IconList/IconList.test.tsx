// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import IconList, { IconListItem } from './IconList'

describe('IconList', () => {
  it('renders correctly', () => {
    render(
      withAppContext(
        <IconList>
          <IconListItem iconUrl="">Icon</IconListItem>
        </IconList>
      )
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBe(1)
  })

  it('renders an empty list', () => {
    render(withAppContext(<IconList />))

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem').length).toBe(0)
  })
})
