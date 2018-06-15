import React from 'react';
import { shallow } from 'enzyme';

import MainMenu from './index';

describe('<MainMenu />', () => {
  it('should render correctly', () => {
    const renderedComponent = shallow(
      <MainMenu />
    );
    expect(renderedComponent).toMatchSnapshot();
  });
});
