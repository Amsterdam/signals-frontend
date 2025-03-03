// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Notice from '..'

describe('Notice', () => {
  it('renders title and content', () => {
    render(withAppContext(<Notice title="Foo" content="Bar" />))

    expect(screen.getByText('Foo')).toBeInTheDocument()
    expect(screen.getByText('Bar')).toBeInTheDocument()
  })
  it('renders multiple paragraphs', () => {
    render(withAppContext(<Notice title="Foo" content={['Bar', 'foobar']} />))

    expect(screen.getByText('Bar')).toBeInTheDocument()
    expect(screen.getByText('foobar')).toBeInTheDocument()
  })
})
