import React from 'react';
import { shallow } from 'enzyme';

import amaps from 'amsterdam-amaps/dist/amaps';

import Map from './index';

jest.mock('amsterdam-amaps/dist/amaps');

describe('<Map />', () => {
  const latlng = {
    latitude: 4,
    longitude: 52
  };

  beforeEach(() => {
    amaps.createMap = jest.fn().mockImplementation(() => ({
      attributionControl: {
        remove: jest.fn()
      },
      zoomControl: {
        remove: jest.fn()
      }
    }));
  });

  it('should render correctly', () => {
    shallow(
      <Map
        latlng={latlng}
      />
    );

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

  it('should render correctly without attribution and zoom controls', () => {
    const wrapper = shallow(
      <Map
        latlng={latlng}
        hideAttribution
        hideZoomControls
      />
    );

    const map = wrapper.instance().map;

    expect(map.attributionControl.remove).toHaveBeenCalled();
    expect(map.zoomControl.remove).toHaveBeenCalled();
  });
});
