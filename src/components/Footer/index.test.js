import React from 'react';
import { shallow } from 'enzyme';

import Footer from './index';
import './style.scss';

describe('<Footer />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Footer />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
