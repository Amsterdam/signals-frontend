import React from 'react';
import { shallow } from 'enzyme';

import amaps from '../../static/pointquery.iife';

import MapInteractive from './index';

jest.mock('../../static/pointquery.iife');

describe('<MapInteractive />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MapInteractive />
    );

    wrapper.setProps({
      location: {}
    });

    expect(wrapper).toMatchSnapshot();

    expect(amaps.createMap).toHaveBeenCalledWith({
      layer: 'standaard',
      target: 'mapdiv',
      marker: false,
      search: true,
      zoom: 14,
      onQueryResult: expect.any(Function)
    });
  });

  it('should not render map when there is one already', () => {
    const wrapper = shallow(
      <MapInteractive />
    );

    wrapper.setState({
      map: {}
    });
    wrapper.setProps({
      location: {}
    });

    expect(wrapper).toMatchSnapshot();

    expect(amaps.createMap).not.toHaveBeenCalled();
  });

  it('should render an existing location correctly', () => {
    const wrapper = shallow(
      <MapInteractive />
    );

    wrapper.setProps({
      location: {
        geometrie: {
          coordinates: [4, 52]
        },
        address: {
          openbare_ruimte: 'Dam',
          huisnummer_toevoeging: 'a',
          postcode: '1000AA',
          woonplaats: 'Amsterdam'
        }
      }
    });

    expect(wrapper).toMatchSnapshot();

    expect(amaps.createMap).toHaveBeenCalledWith({
      center: {
        latitude: 52,
        longitude: 4
      },
      layer: 'standaard',
      target: 'mapdiv',
      marker: true,
      search: true,
      zoom: 14,
      onQueryResult: expect.any(Function)
    });
  });
});
