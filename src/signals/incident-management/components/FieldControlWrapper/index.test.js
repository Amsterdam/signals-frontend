import React from 'react';
import { shallow } from 'enzyme';

import { FormControl } from 'react-reactive-form';
import FieldControlWrapper from './index';

describe('FieldControlWrapper', () => {
  let props;
  let wrapper;
  const values = [
    { key: 'foo', value: 'Foo' }
  ];

  beforeEach(() => {
    props = {
      name: 'inputfield',
      control: new FormControl(),
      render: jest.fn()
    };
  });

  it('should render correctly', () => {
    wrapper = shallow(<FieldControlWrapper {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render values correctly', () => {
    props.values = values;
    wrapper = shallow(<FieldControlWrapper {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render values with empty option correctly', () => {
    props.values = values;
    props.emptyOptionText = 'All';
    wrapper = shallow(<FieldControlWrapper {...props} />);

    wrapper.setProps({
      values: [
        ...values,
        { key: 'bar', value: 'Bar' }
      ]
    });

    expect(wrapper).toMatchSnapshot();
  });
});
