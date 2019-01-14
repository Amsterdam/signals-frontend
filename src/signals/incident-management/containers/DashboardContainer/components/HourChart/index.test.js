import React from 'react';
import { shallow } from 'enzyme';

import HourChart from './index';

describe('<HourChart />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      data: [
        { hour: 0, count: 4 },
        { hour: 1, count: 8 },
        { hour: 2, count: 9 },
        { hour: 3, count: 13 },
        { hour: 4, count: 8 },
        { hour: 5, count: 42 },
        { hour: 6, count: 70 },
        { hour: 7, count: 60 },
        { hour: 8, count: 93 },
        { hour: 9, count: 137 },
        { hour: 10, count: 64 },
        { hour: 11, count: 71 },
        { hour: 12, count: 12 }
      ]
    };

    wrapper = shallow(
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
