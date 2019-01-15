import React from 'react';
import { render } from 'enzyme';

import HourChart from './index';

describe('<HourChart />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      data: [
        {
          dateTime: '2019-01-15T05:00:00+01:00',
          count: 23,
          timestamp: 1547524800000
        },
        {
          dateTime: '2019-01-15T06:00:00+01:00',
          count: 59,
          timestamp: 1547528400000
        },
        {
          dateTime: '2019-01-15T07:00:00+01:00',
          count: 45,
          timestamp: 1547532000000
        },
        {
          dateTime: '2019-01-15T08:00:00+01:00',
          count: 34,
          timestamp: 1547535600000
        },
        {
          dateTime: '2019-01-15T09:00:00+01:00',
          count: 8,
          timestamp: 1547539200000
        },
        {
          dateTime: '2019-01-15T10:00:00+01:00',
          count: 42,
          timestamp: 1547542800000
        },
        {
          dateTime: '2019-01-15T11:00:00+01:00',
          count: 70,
          timestamp: 1547546400000
        },
        {
          dateTime: '2019-01-15T12:00:00+01:00',
          count: 60,
          timestamp: 1547550000000
        },
        {
          dateTime: '2019-01-15T13:00:00+01:00',
          count: 93,
          timestamp: 1547553600000
        },
        {
          dateTime: '2019-01-15T14:00:00+01:00',
          count: 137,
          timestamp: 1547557200000
        },
        {
          dateTime: '2019-01-15T15:00:00+01:00',
          count: 64,
          timestamp: 1547560800000
        },
        {
          dateTime: '2019-01-15T16:00:00+01:00',
          count: 71,
          timestamp: 1547564400000
        },
        {
          dateTime: '2019-01-15T17:00:00+01:00',
          count: 12,
          timestamp: 1547568000000
        }
      ]

    };

    wrapper = render(
      <HourChart {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
