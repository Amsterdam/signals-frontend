// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import ListObjectValue from '..'

describe('signals/incident/components/ListObjectValue', () => {
  /* eslint-disable no-console */
  beforeEach(() => {
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  it('returns a list', () => {
    const value = [{ label: 'Foo' }, { label: 'Bar' }, { label: 'Baz' }]

    const { container } = render(
      withAppContext(<ListObjectValue value={value} />)
    )

    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  it('renders only valid entries', () => {
    const value = [{ label: 'Foo' }, { labl: 'Bar' }, { lael: 'Baz' }]

    const { container } = render(
      withAppContext(<ListObjectValue value={value} />)
    )

    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(1)
  })

  it('renders nothing when the value prop is an empty array', () => {
    const { container } = render(withAppContext(<ListObjectValue value={[]} />))

    expect(container.querySelector('ul')).not.toBeInTheDocument()
  })

  it('renders nothing when the value prop is not an array', () => {
    const { container } = render(withAppContext(<ListObjectValue value={{}} />))

    expect(container.querySelector('ul')).not.toBeInTheDocument()
  })
})
