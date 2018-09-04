import React from 'react';
import { shallow } from 'enzyme';

import amaps from '../../static/pointquery.iife';

import MapInteractive from './index';

jest.mock('../../static/pointquery.iife');

describe('<MapInteractive />', () => {
  let onQueryResult;

  beforeEach(() => {
    // add a mock input this is what the amaps.createMap creates
    const input = global.document.createElement('input');
    input.setAttribute('id', 'nlmaps-geocoder-control-input');
    input.setAttribute('type', 'text');
    global.document.body.appendChild(input);

    onQueryResult = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    // wrapper.setState({
      // map: undefined
    // });

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
      <MapInteractive onQueryResult={onQueryResult} />
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

  it('should render an existing location with address correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    wrapper.setProps({
      location: {
        geometrie: {
          coordinates: [4, 52]
        },
        address: {
          openbare_ruimte: 'Dam',
          huisnummer_toevoeging: '2',
          huisletter: 'C',
          huisnummer: 666,
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

    const value = document.querySelector('#nlmaps-geocoder-control-input').value;
    expect(value).toEqual('Dam 666C-2, 1000AA Amsterdam');
  });

  it('should render an existing location with address without huisnummer_toevoeging correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    wrapper.setProps({
      location: {
        geometrie: {
          coordinates: [4, 52]
        },
        address: {
          openbare_ruimte: 'Dam',
          huisletter: 'C',
          huisnummer: 666,
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

    const value = document.querySelector('#nlmaps-geocoder-control-input').value;
    expect(value).toEqual('Dam 666C, 1000AA Amsterdam');
  });
});
