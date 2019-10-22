import React from 'react';
import { shallow } from 'enzyme';

import MapPreview from './index';

jest.mock('../../../../../../components/Map', () => () => 'Map');

describe('Preview component <Map />', () => {
  const address = {
    openbare_ruimte: 'Hell',
    huisnummer: '666',
    huisletter: 'C',
    postcode: '1087JC',
    woonplaats: 'Amsterdam',
  };
  const geometrie = {
    coordinates: [52, 4],
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MapPreview />);
  });

  it('should render valid adrress and map with latlong correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        address,
        geometrie,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render only latlong correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        geometrie,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render only address correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        address,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render address with toevoeging correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        address: {
          ...address,
          huisnummer_toevoeging: '3',
        },
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
