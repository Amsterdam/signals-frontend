import React from 'react';
import { shallow } from 'enzyme';

import amaps from 'amsterdam-amaps/dist/amaps.es';

import Map from './index';

jest.mock('amsterdam-amaps/dist/amaps.es');

describe('<Map />', () => {
  it('should render correctly', () => {
    const latlng = {
      latitude: 4,
      longitude: 52
    };
    const wrapper = shallow(
      <Map
        latlng={latlng}
      />
    );

    expect(wrapper).toMatchSnapshot();

    expect(amaps.createMap).toHaveBeenCalledWith({
      center: {
        latitude: 4,
        longitude: 52
      },
      layer: 'standaard',
      target: 'mapdiv',
      marker: true,
      search: false,
      zoom: 16
    });
  });
});
