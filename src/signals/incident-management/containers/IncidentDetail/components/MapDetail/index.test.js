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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    wrapper = shallow(<MapDetail {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly without location', () => {
    props.value = {};
    wrapper = shallow(<MapDetail {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
