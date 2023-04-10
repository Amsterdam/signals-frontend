// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import SelectInputSearch from '..'

describe('<SelectInputSearch />', () => {
  let props

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { key: '', value: 'none', slug: '', _display: '', group: 'a' },
        {
          key: '1',
          value: 'item1',
          slug: 'item-1',
          _display: 'description-1',
          group: 'a',
        },
        {
          key: '2',
          value: 'item2',
          slug: 'item-2',
          _display: 'description-2',
          group: 'b',
        },
      ],
      groups: [
        { key: 'a', value: 'a' },
        { key: 'b', value: 'b' },
      ],
      multiple: false,
      size: 4,
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const { queryByTestId } = render(
      withAppContext(<SelectInputSearch {...props} />)
    )

    const input = screen.getByRole('combobox')
    input.focus()

    userEvent.keyboard('{arrowdown}')

    // get options by role option
    const options = screen.getAllByRole('option')

    expect(options).toHaveLength(props.values.length)
    expect(options[0].textContent).toEqual('none')
    expect(queryByTestId(props.name)).not.toBeNull()
  })

  it('should render correctly with using slugs', () => {
    const useSlug = true
    props = { ...props, useSlug }
    render(withAppContext(<SelectInputSearch {...props} />))

    userEvent.keyboard('{arrowdown}')

    const options = screen.getAllByRole('option')
    options.forEach((option, index) => {
      if (!index === 0) {
        expect(option.textContent).toEqual(props.values[index].slug)
      }
    })
  })

  describe('falsy keys', () => {
    it('should render correctly with empty string', () => {
      render(withAppContext(<SelectInputSearch {...props} />))

      const input = screen.getByRole('combobox')
      input.focus()
      userEvent.keyboard('{arrowdown}')

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(props.values.length)
      expect(options[0].textContent).toEqual('none')
      expect(options[1].textContent).toEqual('item1')
      expect(options[2].textContent).toEqual('item2')
    })
  })
})
