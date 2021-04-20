// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import PaginationItem from '..'
import { NEXT, PREVIOUS } from '../../../utils'

describe('src/components/PaginationItem', () => {
  it('should render an icon', () => {
    const { container, rerender, getByTestId } = render(
      withAppContext(<PaginationItem label="Some label" pageNum={PREVIOUS} />)
    )

    expect(container.firstChild.querySelectorAll('svg')).toHaveLength(0)

    rerender(
      withAppContext(
        <PaginationItem label="Some label" pageNum={PREVIOUS} isNav />
      )
    )

    expect(
      getByTestId('pagination-previous').querySelectorAll('svg')
    ).toHaveLength(1)

    rerender(
      withAppContext(<PaginationItem label="Some label" pageNum={NEXT} isNav />)
    )

    expect(getByTestId('pagination-next').querySelectorAll('svg')).toHaveLength(
      1
    )
  })

  it('should render a label', () => {
    const label = 'Foo bar baz'
    const { getByText } = render(
      withAppContext(<PaginationItem label={label} pageNum={1} />)
    )

    expect(getByText(label)).toBeInTheDocument()
  })

  it('should handle onClick', () => {
    const onClick = jest.fn()
    const { container } = render(
      withAppContext(
        <PaginationItem label="Foo bar baz" pageNum={1} onClick={onClick} />
      )
    )

    fireEvent.click(container.firstChild)

    expect(onClick).toHaveBeenCalled()
  })

  it('should render an anchor', () => {
    const { container } = render(
      withAppContext(
        <PaginationItem
          label="Foo bar baz"
          pageNum={1}
          shouldPushToHistory
          to="/foo/bar?page=1"
        />
      )
    )

    expect(container.querySelectorAll('a')).toHaveLength(1)
  })

  it('should render a button', () => {
    const { container } = render(
      withAppContext(<PaginationItem label="Foo bar baz" pageNum={1} />)
    )

    expect(container.querySelectorAll('button')).toHaveLength(1)
  })
})
