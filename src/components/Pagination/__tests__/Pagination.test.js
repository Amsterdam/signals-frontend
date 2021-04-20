// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import Pagination from '..'

describe('src/components/Pagination', () => {
  const totalPages = 10

  it('should not render anything when there is just one page', () => {
    const { queryByTestId, rerender } = render(
      withAppContext(<Pagination totalPages={0} currentPage={1} />)
    )

    expect(queryByTestId('pagination')).not.toBeInTheDocument()

    rerender(withAppContext(<Pagination totalPages={1} currentPage={1} />))

    expect(queryByTestId('pagination')).not.toBeInTheDocument()

    rerender(withAppContext(<Pagination totalPages={2} currentPage={1} />))

    expect(queryByTestId('pagination')).toBeInTheDocument()
  })

  it('should render only next button', () => {
    const { queryByTestId } = render(
      withAppContext(<Pagination totalPages={totalPages} currentPage={1} />)
    )

    expect(queryByTestId('pagination-previous')).not.toBeInTheDocument()
    expect(queryByTestId('pagination-next')).toBeInTheDocument()
  })

  it('should render previous and next buttons', () => {
    const { queryByTestId } = render(
      withAppContext(<Pagination totalPages={totalPages} currentPage={4} />)
    )

    expect(queryByTestId('pagination-previous')).toBeInTheDocument()
    expect(queryByTestId('pagination-next')).toBeInTheDocument()
  })

  it('should render only previous button', () => {
    const { queryByTestId } = render(
      withAppContext(
        <Pagination totalPages={totalPages} currentPage={totalPages} />
      )
    )

    expect(queryByTestId('pagination-previous')).toBeInTheDocument()
    expect(queryByTestId('pagination-next')).not.toBeInTheDocument()
  })

  it('should render page items', () => {
    const { getByText } = render(
      withAppContext(<Pagination totalPages={totalPages} currentPage={4} />)
    )

    expect(getByText('3')).toBeInTheDocument()
    expect(getByText('5')).toBeInTheDocument()
    // active page item should not be a link
    expect(getByText('4').getAttribute('href')).toBeFalsy()
  })

  it('should handle onClick', () => {
    const onClick = jest.fn()
    const { getByText } = render(
      withAppContext(
        <Pagination totalPages={totalPages} currentPage={1} onClick={onClick} />
      )
    )

    fireEvent.click(getByText('2'))

    expect(onClick).toHaveBeenCalledWith(2)
  })

  it('should navigate back', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      withAppContext(
        <Pagination totalPages={totalPages} currentPage={4} onClick={onClick} />
      )
    )

    const prevAnchor = getByTestId('pagination-previous')

    fireEvent.click(prevAnchor)

    expect(onClick).toHaveBeenCalledWith(3)
  })

  it('should navigate forward', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      withAppContext(
        <Pagination totalPages={totalPages} currentPage={4} onClick={onClick} />
      )
    )

    const nextAnchor = getByTestId('pagination-next')

    fireEvent.click(nextAnchor)

    expect(onClick).toHaveBeenCalledWith(5)
  })
})
