import React from 'react';
import { shallow } from 'enzyme';

import MapDetail from './index';

describe('<MapDetail />', () => {
  let wrapper;
  const props = {
    value: {
      geometrie: { coordinates: [0, 0] }
    }
  };
  beforeEach(() => {
    wrapper = shallow(<MapDetail {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
