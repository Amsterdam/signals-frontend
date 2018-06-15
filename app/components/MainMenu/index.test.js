import React from 'react';
import { shallow } from 'enzyme';

import MainMenu from './index';

describe('<MainMenu />', () => {
  let renderedComponent;

  beforeEach(() => {
    renderedComponent = shallow(
      <MainMenu />
    );
  });

  it('should render correctly', () => {
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render render 3 NavLink components', () => {
    expect(renderedComponent.find('NavLink').length).toEqual(3);
  });
});
