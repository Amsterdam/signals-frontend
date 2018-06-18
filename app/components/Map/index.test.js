import React from 'react';
import { shallow } from 'enzyme';

import Map from './index';

describe('<Map />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <Map />
    );
    expect(renderedComponent.find('div').length).toEqual(1);
  });
});
