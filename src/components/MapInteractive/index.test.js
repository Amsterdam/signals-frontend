import React from 'react';
import { shallow } from 'enzyme';

import pointquery from 'amsterdam-amaps/dist/pointquery';

import MapInteractive from './index';

jest.mock('amsterdam-amaps/dist/pointquery');

describe.only('<MapInteractive />', () => {
  let input;
  let onQueryResult;

  beforeEach(() => {
    // add a mock input this is what the pointquery.createMap creates
    input = global.document.createElement('input');
    input.setAttribute('id', 'nlmaps-geocoder-control-input');
    input.setAttribute('type', 'text');

    onQueryResult = jest.fn();
    global.document.body.appendChild(input);
    const mockMap = new Promise((resolve) => resolve({
      returns: 'valid map',
      eachLayer: jest.fn()
    }));
    pointquery.createMap.mockImplementation(() => mockMap);
  });

  afterEach(() => {
    global.document.body.removeChild(input);
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    expect(wrapper).toMatchSnapshot();

    expect(pointquery.createMap).toHaveBeenCalledWith({
      layer: 'standaard',
      target: 'mapdiv-interactive',
      marker: false,
      search: true,
      zoom: 14,
      onQueryResult: expect.any(Function)
    });
  });

  it('should render an existing location with address correctly', () => {
    const location = {
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
    };

    shallow(
      <MapInteractive onQueryResult={onQueryResult} location={location} />
    );

    expect(pointquery.createMap).toHaveBeenCalledWith({
      center: {
        latitude: 52,
        longitude: 4
      },
      layer: 'standaard',
      target: 'mapdiv-interactive',
      marker: true,
      search: true,
      zoom: 16,
      onQueryResult: expect.any(Function)
    });

    const value = document.querySelector('#nlmaps-geocoder-control-input').value;
    expect(value).toEqual('Dam 666C-2, 1000AA Amsterdam');
  });

  it('should render an existing location with address without huisnummer_toevoeging correctly', () => {
    const location = {
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
    };

    shallow(
      <MapInteractive onQueryResult={onQueryResult} location={location} />
    );

    expect(pointquery.createMap).toHaveBeenCalledWith({
      center: {
        latitude: 52,
        longitude: 4
      },
      layer: 'standaard',
      target: 'mapdiv-interactive',
      marker: true,
      search: true,
      zoom: 16,
      onQueryResult: expect.any(Function)
    });

    const value = document.querySelector('#nlmaps-geocoder-control-input').value;
    expect(value).toEqual('Dam 666C, 1000AA Amsterdam');
  });
});
