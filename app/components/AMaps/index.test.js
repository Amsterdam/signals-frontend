import React from 'react';
import { shallow } from 'enzyme';
import 'leaflet/dist/leaflet';

import Map from './index';

describe('The map component', () => {
  it('should render the component', () => {
    const componentDidMountSpy = jest.spyOn(Map.prototype, 'componentDidMount').mockImplementation(() => true);
    const renderedComponent = shallow(
      <Map />
    );
    expect(componentDidMountSpy).toHaveBeenCalled();
    expect(renderedComponent.find('div').length).toBeGreaterThan(1);
  });
});
