// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import LinkButton from '..'
import { withAppContext } from 'test/utils'

describe('LinkButton', () => {
  it('renders a link button with heading', () => {
    render(
      withAppContext(
        <LinkButton meta={{ href: '/', label: 'Foo', title: 'Bar' }} />
      )
    )

    expect(screen.getByRole('heading', { name: 'Bar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Foo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Foo' })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
