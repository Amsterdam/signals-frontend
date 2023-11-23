// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import type configurationType from 'shared/services/configuration/__mocks__/configuration'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import IconList, { IconListItem } from './IconList'

jest.mock('shared/services/configuration/configuration')

const mockConfiguration = configuration as typeof configurationType

describe('IconList', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    mockConfiguration.__reset()
  })

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

    expect(screen.queryByRole('checkbox')).toBeInTheDocument()
  })

  it('renders an empty list', () => {
    render(withAppContext(<IconList />))

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem').length).toBe(0)
  })
})
