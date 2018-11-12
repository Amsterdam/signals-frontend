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
});
