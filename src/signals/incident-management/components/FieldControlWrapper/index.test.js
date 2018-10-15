import React from 'react';
import { shallow } from 'enzyme';

import { FormControl } from 'react-reactive-form';
import FieldControlWrapper from './index';

describe('FieldControlWrapper', () => {
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

  it('should render values correctly', () => {
    wrapper.setProps({
      values: [
        { key: 'foo', value: 'Foo' },
        { key: 'bar', value: 'Bar' }
      ]
    });


    expect(wrapper).toMatchSnapshot();
    expect(props.render).toHaveBeenCalledWith({
      name: 'inputfield',
      values: []
    });
  });

  it('should render values with empty option correctly', () => {
    wrapper.setProps({
      values: [
        { key: 'foo', value: 'Foo' },
        { key: 'bar', value: 'Bar' }
      ],
      emptyOptionText: 'All'
    });


    expect(wrapper).toMatchSnapshot();
  });
});
