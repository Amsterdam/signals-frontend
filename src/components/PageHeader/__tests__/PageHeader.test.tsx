// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import PageHeader from '../index'

describe('settings/components/PageHeader', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      withAppContext(<PageHeader title="Foo bar baz" />)
    )

    expect(getByText('Foo bar baz')).toBeTruthy()
  })
})
