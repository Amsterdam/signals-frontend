import React from 'react';
import { shallow } from 'enzyme';

import Footer from './index';
import './style.scss';

describe('<Footer />', () => {
  it('should render correctly', () => {
    const renderedComponent = shallow(
      <Footer />
    );
    expect(renderedComponent).toMatchSnapshot();
  });
});
