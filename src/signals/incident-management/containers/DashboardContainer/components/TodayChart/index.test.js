import React from 'react';
import { shallow } from 'enzyme';

import TodayChart from './index';

describe('<TodayChart />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
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
    wrapper = shallow(<TodayChart {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
