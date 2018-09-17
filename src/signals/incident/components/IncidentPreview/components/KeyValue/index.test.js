import React from 'react';
import { shallow } from 'enzyme';

import KeyValue from './index';

describe('Preview component <KeyValue />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<KeyValue />);
  });

  it('should render key value correctly', () => {
    wrapper.setProps({
      label: 'Urgentie',
      value: 'normal',
      values: {
        normal: 'Normaal',
        high: 'Hoog'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render optional key value correctly', () => {
    wrapper.setProps({
      label: 'Urgentie',
      optional: true,
      value: 'normal',
      values: {
        normal: 'Normaal',
        high: 'Hoog'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render optional key value when value is empty', () => {
    wrapper.setProps({
      label: 'Urgentie',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
