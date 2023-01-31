// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import SelectInput from '..'

describe('<SelectInput />', () => {
  let props

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { key: '', value: 'none', slug: '', _display: '' },
        { key: '1', value: 'item1', slug: 'item-1', _display: 'description-1' },
        { key: '2', value: 'item2', slug: 'item-2', _display: 'description-2' },
      ],
      multiple: false,
      size: 4,
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const { container, queryByTestId } = render(
      withAppContext(<SelectInput {...props} />)
    )

    const options = container.firstChild.querySelectorAll('option')
    expect(options).toHaveLength(props.values.length)
    expect(options[0].textContent).toEqual('none')
    expect(queryByTestId(props.name)).not.toBeNull()
  })

  it('should render correctly with empty option select', () => {
    const emptyOption = {
      key: '',
      name: 'All the things!!1!',
      value: '',
      group: '',
    }
    props = { ...props, emptyOption }
    const { container } = render(withAppContext(<SelectInput {...props} />))

    const options = container.firstChild.querySelectorAll('option')
    expect(options).toHaveLength(props.values.length + 1)
    expect(options[0].textContent).toEqual(emptyOption.name)
  })

  it('should render correctly with using slugs', () => {
    const useSlug = true
    props = { ...props, useSlug }
    const { container } = render(withAppContext(<SelectInput {...props} />))

    const options = container.firstChild.querySelectorAll('option')
    options.forEach((option, index) => {
      if (!index === 0) {
        expect(option.textContent).toEqual(props.values[index].slug)
      }
    })
  })

  describe('falsy keys', () => {
    it('should render correctly with empty string', () => {
      const { container } = render(withAppContext(<SelectInput {...props} />))

      const options = container.firstChild.querySelectorAll('option')
      expect(options).toHaveLength(props.values.length)
      expect(options[0].textContent).toEqual('none')
      expect(options[1].textContent).toEqual('item1')
      expect(options[2].textContent).toEqual('item2')
    })

    it('should render correctly with undefined', () => {
      props = {
        ...props,
        values: [
          { value: 'none', slug: '', _display: '' },
          ...props.values.slice(1),
        ],
      }
      const { container } = render(withAppContext(<SelectInput {...props} />))

      const options = container.firstChild.querySelectorAll('option')
      expect(options).toHaveLength(props.values.length)
      expect(options[0].textContent).toEqual('none')
      expect(options[1].textContent).toEqual('item1')
      expect(options[2].textContent).toEqual('item2')
    })

    it('should render correctly with null', () => {
      props = {
        ...props,
        values: [
          { key: null, value: 'none', slug: '', _display: '' },
          ...props.values.slice(1),
        ],
      }
      const { container } = render(withAppContext(<SelectInput {...props} />))

      const options = container.firstChild.querySelectorAll('option')
      expect(options).toHaveLength(props.values.length)
      expect(options[0].textContent).toEqual('none')
      expect(options[1].textContent).toEqual('item1')
      expect(options[2].textContent).toEqual('item2')
    })

    it('should render correctly with false', () => {
      props = {
        ...props,
        values: [
          { key: false, value: 'none', slug: '', _display: '' },
          ...props.values.slice(1),
        ],
      }
      const { container } = render(withAppContext(<SelectInput {...props} />))

      const options = container.firstChild.querySelectorAll('option')
      expect(options).toHaveLength(props.values.length)
      expect(options[0].textContent).toEqual('none')
      expect(options[1].textContent).toEqual('item1')
      expect(options[2].textContent).toEqual('item2')
    })

    it('should render correctly with zero', () => {
      props = {
        ...props,
        values: [
          { key: 0, value: 'none', slug: '', _display: '' },
          ...props.values.slice(1),
        ],
      }
      const { container } = render(withAppContext(<SelectInput {...props} />))

      const options = container.firstChild.querySelectorAll('option')
      expect(options).toHaveLength(props.values.length)
      expect(options[0].textContent).toEqual('none')
      expect(options[1].textContent).toEqual('item1')
      expect(options[2].textContent).toEqual('item2')
    })
  })
})
