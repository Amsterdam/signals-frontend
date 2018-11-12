import React from 'react';
import { shallow } from 'enzyme';

import { FormControl } from 'react-reactive-form';
import FieldControlWrapper from './index';

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

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('check for correct setting of values', () => {
    it('should have correct default values', () => {
      expect(wrapper.state('values')).toEqual([]);
    });

    it('should set new values', () => {
      wrapper.setProps({ values });

      expect(wrapper.state('values')).toEqual(values);
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

      expect(wrapper.state('values')).toEqual([{ key: '', value: 'Selecteer...' }, { key: 'bar', value: 'Bar' }, ...values]);
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
