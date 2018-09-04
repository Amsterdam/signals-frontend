import React from 'react';
import { shallow } from 'enzyme';

import DateTime from './index';

describe('Preview component <DateTime />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DateTime />);
  });

  it('should render now correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: 'Nu'
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render earlier today correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: 'Eerder',
      incident: {
        incident_date: 'Vandaag',
        incident_time_hours: 13,
        incident_time_minutes: 45
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render earlier date correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: 'Eerder',
      incident: {
        incident_date: '2018-02-21',
        incident_time_hours: 6,
        incident_time_minutes: 66
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render optional date correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: 'Nu',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render optional date when value is empty', () => {
    wrapper.setProps({
      label: 'Datetime',
      optional: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
