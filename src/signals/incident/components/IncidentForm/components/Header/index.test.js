import React from 'react';
import { shallow } from 'enzyme';

import Header from './index';

describe('Form component <Header />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  it('should render correctly', () => {
    wrapper.setProps({
      meta: {
        label: 'Header'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });
});
