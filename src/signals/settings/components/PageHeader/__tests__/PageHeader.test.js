// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import PageHeader from '..'

describe('settings/components/PageHeader', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      withAppContext(<PageHeader title="Foo bar baz" />)
    )

    expect(getByText('Foo bar baz')).toBeTruthy()
  })
})
