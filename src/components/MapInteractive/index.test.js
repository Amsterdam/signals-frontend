import React from 'react';
import { shallow } from 'enzyme';

import pointquery from 'amsterdam-amaps/dist/pointquery';

import MapInteractive from './index';

jest.mock('amsterdam-amaps/dist/pointquery');

describe('<MapInteractive />', () => {
  let input;
  let onQueryResult;

  beforeEach(() => {
    // add a mock input this is what the pointquery.createMap creates
    input = global.document.createElement('input');
    input.setAttribute('id', 'nlmaps-geocoder-control-input');
    input.setAttribute('type', 'text');
    global.document.body.appendChild(input);

    onQueryResult = jest.fn();
  });

  afterEach(() => {
    global.document.body.removeChild(input);
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    wrapper.setProps({
      location: {}
    });

    expect(wrapper).toMatchSnapshot();

    expect(pointquery.createMap).toHaveBeenCalledWith({
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

    expect(pointquery.createMap).not.toHaveBeenCalled();
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

    expect(pointquery.createMap).toHaveBeenCalledWith({
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

    expect(pointquery.createMap).toHaveBeenCalledWith({
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

  it('should render an existing location with no address correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    wrapper.setProps({
      location: {
        geometrie: {
          coordinates: [4, 52]
        },
        address: false
      }
    });

    const value = document.querySelector('#nlmaps-geocoder-control-input').value;
    expect(value).toEqual('');
  });

  it('should render placeholder correctly', () => {
    const wrapper = shallow(
      <MapInteractive onQueryResult={onQueryResult} />
    );

    wrapper.setProps({
      location: {
        geometrie: {
          coordinates: [4, 52]
        },
        address: false
      }
    });

    expect(document.querySelector('#nlmaps-geocoder-control-input').placeholder).toEqual('Zoek adres');

    input.setAttribute('id', 'invalid');

    wrapper.setProps({
      location: {
        geometrie: {
          coordinates: [4, 53]
        },
        address: false
      }
    });

    expect(document.querySelector('#nlmaps-geocoder-control-input')).toEqual(null);
  });
});
