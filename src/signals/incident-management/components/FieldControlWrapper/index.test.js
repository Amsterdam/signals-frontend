import React from 'react';
import { shallow } from 'enzyme';

import { FormControl } from 'react-reactive-form';
import FieldControlWrapper from './index';

describe('FieldControlWrapper', () => {
  it('should render correctly', () => {
    const props = { name: 'name', control: new FormControl(), render: jest.fn() };
    const wrapper = shallow(<FieldControlWrapper {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
