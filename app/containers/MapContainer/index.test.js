import React from 'react';
import { shallow } from 'enzyme';

import { MapContainer, mapDispatchToProps } from '.';
import { getGeoName } from './actions';

jest.mock('../../static/amaps.es');

describe('<MapContainer />', () => {
  it('should render the Map', () => {
    const props = {
      getGeoName: jest.fn(),
      mapcontainer: {
        isLoading: false,
        location: '',
        latlng: {}
      },
      onLocationChange: jest.fn()
    };

    const renderedComponent = shallow(
      <MapContainer {...props} />
    );

    // console.log('renderedComponent: ', renderedComponent.debug());
    expect(renderedComponent.find('Map').length).toBe(1);
  });

  describe('mapDispatchToProps', () => {
    describe('getGeoName', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.getGeoName).toBeDefined();
      });

      it('should dispatch getGeoName when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const latlng = {};
        result.getGeoName(latlng);
        expect(dispatch).toHaveBeenCalledWith(getGeoName(latlng));
      });
    });
  });
});
