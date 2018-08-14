import React from 'react';
import { shallow } from 'enzyme';

import PlainText from './index';

describe('Preview component <PlainText />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlainText />);
  });

  it('should render text correctly', () => {
    wrapper.setProps({
      label: 'Title',
      value: 'Plain text'
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render optional text correctly', () => {
    wrapper.setProps({
      label: 'Title',
      optional: true,
      value: 'Plain text'
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render optional image when value is empty', () => {
    wrapper.setProps({
      label: 'Title',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
