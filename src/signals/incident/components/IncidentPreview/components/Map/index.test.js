import React from 'react';
import { shallow } from 'enzyme';

import MapPreview from './index';

jest.mock('../../../../../../components/Map', () => () => 'Map');

describe('Preview component <Map />', () => {
  const addressText = 'Hell 666C, 1087JC Amsterdam';
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
        addressText,
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
        addressText,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render address with toevoeging correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        addressText: 'Hell 666C-3, 1087JC Amsterdam',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
