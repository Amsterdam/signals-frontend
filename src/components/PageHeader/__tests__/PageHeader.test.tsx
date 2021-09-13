// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import PageHeader from '..'

describe('components/PageHeader', () => {
  it('renders required elements', () => {
    const title = 'Foo'
    const subTitle = 'Bar'
    render(withAppContext(<PageHeader title={title} subTitle={subTitle} />))

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByText(subTitle)).toBeInTheDocument()
  })
})
