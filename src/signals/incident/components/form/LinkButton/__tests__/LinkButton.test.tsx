// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import LinkButton from '..'

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

  it('renders a link button without heading', () => {
    render(
      withAppContext(
        <LinkButton meta={{ href: '/', label: 'Foo', title: '' }} />
      )
    )

    expect(
      screen.queryByRole('heading', { name: 'Bar' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Foo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Foo' })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
