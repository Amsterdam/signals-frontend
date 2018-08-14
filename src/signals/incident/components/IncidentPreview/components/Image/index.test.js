import React from 'react';
import { shallow } from 'enzyme';

import Image from './index';

describe('<Image />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Image />);
  });

  it('should render image correctly', () => {
    wrapper.setProps({
      label: 'Image',
      value: 'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c'
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render optionsal image correctly', () => {
    wrapper.setProps({
      label: 'Image',
      optional: true,
      value: 'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c'
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render optional image when value is empty', () => {
    wrapper.setProps({
      label: 'Image',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
