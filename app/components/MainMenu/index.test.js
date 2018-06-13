import React from 'react';
import { shallow } from 'enzyme';

import MainMenu from './index';

describe('<MainMenu />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <MainMenu />
    );
    expect(renderedComponent.find('div').length).toEqual(1);
  });
});
