import React from 'react';
import { shallow } from 'enzyme';

import KeyValue from './index';

describe('Preview component <KeyValue />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<KeyValue />);
  });

  it('should render text correctly', () => {
    wrapper.setProps({
      label: 'Prioriteit',
      value: 'normal',
      values: {
        normal: 'Normaal',
        high: 'Hoog'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render optional text correctly', () => {
    wrapper.setProps({
      label: 'Prioriteit',
      optional: true,
      value: 'normal',
      values: {
        normal: 'Normaal',
        high: 'Hoog'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render optional image when value is empty', () => {
    wrapper.setProps({
      label: 'Prioriteit',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
