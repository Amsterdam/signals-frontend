import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import TodayChart from './index';

jest.mock('moment');

describe('<TodayChart />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    moment.mockImplementation(() => ({
      format: () => 'vrijdag 11 januari 2019'
    }));

    props = {
      data: { count: 639 }
    };

    wrapper = shallow(
      <TodayChart {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
