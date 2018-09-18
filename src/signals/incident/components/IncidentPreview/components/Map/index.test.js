import React from 'react';
import { shallow } from 'enzyme';

import Map from './index';

describe('Preview component <Map />', () => {
  const address = {
    openbare_ruimte: 'Hell',
    huisnummer: '666',
    huisletter: 'C'
  };
  const geometrie = {
    coordinates: [52, 4]
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Map />);
  });

  it('should render valid adrress and map with latlong correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        address,
        geometrie
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render only latlong correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        geometrie
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render only address correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        address
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render optional map correctly', () => {
    wrapper.setProps({
      label: 'Location',
      value: {
        address,
        geometrie
      },
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render optional map when value is empty', () => {
    wrapper.setProps({
      label: 'Location',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
