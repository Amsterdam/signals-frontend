import React from 'react';
import { shallow } from 'enzyme';

import Img from './index';

const src = 'test.png';
const alt = 'test';
const renderComponent = (props = {}) => shallow(
  <Img src={src} alt={alt} {...props} />
);

describe('<Img />', () => {
  it('should render an <img> tag', () => {
    const wrapper = renderComponent();
    expect(wrapper.is('img')).toBe(true);
  });

  it('should have an src attribute', () => {
    const wrapper = renderComponent();
    expect(wrapper.prop('src')).toEqual(src);
  });

  it('should have an alt attribute', () => {
    const wrapper = renderComponent();
    expect(wrapper.prop('alt')).toEqual(alt);
  });

  it('should not have a className attribute', () => {
    const wrapper = renderComponent();
    expect(wrapper.prop('className')).toBeUndefined();
  });

  it('should adopt a className attribute', () => {
    const className = 'test';
    const wrapper = renderComponent({ className });
    expect(wrapper.hasClass(className)).toBe(true);
  });

  it('should not adopt a srcset attribute', () => {
    const srcset = 'test-HD.png 2x';
    const wrapper = renderComponent({ srcset });
    expect(wrapper.prop('srcset')).toBeUndefined();
  });
});
