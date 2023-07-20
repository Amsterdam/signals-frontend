// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { render, fireEvent } from '@testing-library/react'

import { withAppContext, userObjects } from 'test/utils'

import List from '..'

const users = userObjects()

// temp disabled
describe('components/List', () => {
  it('returns null when there are no items to render', () => {
    const { container, rerender } = render(withAppContext(<List items={[]} />))

    expect(container.querySelector('table')).not.toBeInTheDocument()

    rerender(withAppContext(<List items={users} />))

    expect(container.querySelector('table')).toBeInTheDocument()
  })

  it('renders column in the correct order', () => {
    const columnOrder = ['roles', 'username', 'id', 'is_active']
    const { container } = render(
      withAppContext(<List items={users} columnOrder={columnOrder} />)
    )

    expect(
      [...container.querySelectorAll('th')].map((header) => header.textContent)
    ).toEqual(columnOrder)
  })

  it('does not render columns marked as invisible', () => {
    const { container } = render(
      withAppContext(<List items={users} invisibleColumns={['id']} />)
    )

    container.querySelectorAll('thead td').forEach((element) => {
      expect(element.textContent).not.toEqual('id')
    })
  })

  it('should set data-itemid', () => {
    const primaryKeyColumn = 'id'
    const randomUser = users[Math.floor(Math.random() * users.length)]

    const { container } = render(
      withAppContext(<List items={users} primaryKeyColumn={primaryKeyColumn} />)
    )
    expect(
      container.querySelector(`[data-item-id="${randomUser.id}"]`)
    ).toBeInTheDocument()
  })

  it('handles callback on row click', () => {
    const onItemClick = jest.fn()

    const { container } = render(
      withAppContext(<List items={users} onItemClick={onItemClick} />)
    )

    expect(onItemClick).toHaveBeenCalledTimes(0)

    fireEvent.click(container.querySelector('tbody > tr:nth-child(10)'))

    expect(onItemClick).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(container.querySelector('tbody > tr:nth-child(10)'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    })

    expect(onItemClick).toHaveBeenCalledTimes(2)
  })
})
