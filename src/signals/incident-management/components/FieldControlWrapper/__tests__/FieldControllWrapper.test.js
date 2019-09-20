import React from 'react';
import { shallow } from 'enzyme';
import { render, cleanup } from '@testing-library/react';

import { FormControl } from 'react-reactive-form';
import FieldControlWrapper from '../index';
import TextInput from '../../TextInput';
import HiddenInput from '../../HiddenInput';

describe('FieldControlWrapper', () => {
  const values = [{ key: 'foo', value: 'Foo' }];
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      name: 'inputfield',
      control: new FormControl(),
      render: jest.fn()
    };

    wrapper = shallow(<FieldControlWrapper {...props} />);
  });

  afterEach(cleanup);

  it('should render a text input', () => {
    const { container } = render(<FieldControlWrapper {...props} render={TextInput} />);
    expect(container.querySelector('label')).not.toBeNull();
    expect(container.querySelector('input[type="text"]')).not.toBeNull();
  });

  it('should render a hidden input', () => {
    const { container } = render(<FieldControlWrapper {...props} render={HiddenInput} />);
    expect(container.querySelector('label')).toBeNull();
    expect(container.querySelector('input[type="hidden"]')).not.toBeNull();
  });

  describe('check for correct setting of values', () => {
    it('should have correct default values', () => {
      expect(wrapper.state('values')).toEqual([]);
    });

    it('should only render when there are new values', () => {
      props.control.updateValueAndValidity = jest.fn();
      wrapper.setProps({ values });

      expect(wrapper.state('values')).toEqual(values);
      expect(props.control.updateValueAndValidity).toHaveBeenCalledTimes(1);
    });

    it('should not render when values are equal', () => {
      props.control.updateValueAndValidity = jest.fn();
      wrapper.setProps({ values });

      expect(wrapper.state('values')).toEqual(values);

      wrapper.setProps({ values });
      expect(props.control.updateValueAndValidity).toHaveBeenCalledTimes(1);
    });

    it('should sort the values alphabettically', () => {
      wrapper.setProps({
        sort: true,
        values: [...values, { key: 'bar', value: 'Bar' }]
      });

      expect(wrapper.state('values')).toEqual([{ key: 'bar', value: 'Bar' }, ...values]);
    });

    it('should add empty option and sort values together', () => {
      wrapper.setProps({
        sort: true,
        values: [...values, { key: 'bar', value: 'Bar' }],
        emptyOptionText: 'Selecteer...'
      });

      expect(wrapper.state('values')).toEqual([{ key: '', value: 'Selecteer...', slug: '' }, { key: 'bar', value: 'Bar' }, ...values]);
    });
  });

  it('should not add an empty option if it already exists', () => {
    wrapper.setProps({
      values: [{ key: '', value: 'Selecteer...' }, ...values],
      emptyOptionText: 'Selecteer...'
    });

    expect(wrapper.state('values')).toEqual([{ key: '', value: 'Selecteer...' }, ...values]);
  });
});
