// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { render } from '@testing-library/react'

import { FormControl } from 'react-reactive-form'
import FieldControlWrapper from '..'
import TextInput from '../../TextInput'
import HiddenInput from '../../HiddenInput'

Enzyme.configure({ adapter: new Adapter() })

describe('FieldControlWrapper', () => {
  const values = [{ key: 'foo', value: 'Foo' }]
  let props
  let wrapper

  beforeEach(() => {
    props = {
      name: 'inputfield',
      control: new FormControl(),
      render: jest.fn(),
    }

    wrapper = shallow(<FieldControlWrapper {...props} />)
  })

  it('should render a text input', () => {
    const { container } = render(
      <FieldControlWrapper {...props} render={TextInput} />
    )
    expect(container.querySelector('label')).not.toBeNull()
    expect(container.querySelector('input[type="text"]')).not.toBeNull()
  })

  it('should render a hidden input', () => {
    const { container } = render(
      <FieldControlWrapper {...props} render={HiddenInput} />
    )
    expect(container.querySelector('label')).toBeNull()
    expect(container.querySelector('input[type="hidden"]')).not.toBeNull()
  })

  describe('check for correct setting of values', () => {
    it('should have correct default values', () => {
      expect(wrapper.state('values')).toEqual([])
    })

    it('should only render when there are new values', () => {
      props.control.updateValueAndValidity = jest.fn()
      wrapper.setProps({ values })

      expect(wrapper.state('values')).toEqual(values)
      expect(props.control.updateValueAndValidity).toHaveBeenCalledTimes(1)
    })

    it('should not render when values are equal', () => {
      props.control.updateValueAndValidity = jest.fn()
      wrapper.setProps({ values })

      expect(wrapper.state('values')).toEqual(values)

      wrapper.setProps({ values })
      expect(props.control.updateValueAndValidity).toHaveBeenCalledTimes(1)
    })

    it('should sort the values alphabettically', () => {
      wrapper.setProps({
        sort: true,
        values: [...values, { key: '', value: 'Bar' }],
      })

      expect(wrapper.state('values')).toEqual([
        ...values,
        { key: '', value: 'Bar' },
      ])

      wrapper.setProps({
        sort: true,
        values: [...values, { key: 'bar', value: 'Bar' }],
      })

      expect(wrapper.state('values')).toEqual([
        { key: 'bar', value: 'Bar' },
        ...values,
      ])
    })

    it('should fall back to `name` prop in case `value` prop is not present in values', () => {
      wrapper.setProps({
        sort: true,
        values: [
          { key: 'foo', name: 'Foo' },
          { key: 'bar', value: 'Bar' },
        ],
      })

      expect(wrapper.state('values')).toEqual([
        { key: 'bar', value: 'Bar' },
        { key: 'foo', name: 'Foo' },
      ])
    })
  })

  it('should not add an empty option if it already exists', () => {
    wrapper.setProps({
      values: [{ key: '', value: 'Selecteer...' }, ...values],
      emptyOption: { key: '', value: 'Selecteer...' },
    })

    expect(wrapper.state('values')).toEqual([
      { key: '', value: 'Selecteer...' },
      ...values,
    ])
  })
})
