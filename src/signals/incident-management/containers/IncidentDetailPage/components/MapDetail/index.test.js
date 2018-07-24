import React from 'react';
import { shallow } from 'enzyme';

import MapDetail from './index';

describe('<MapDetail />', () => {
  let renderedComponent;
  const props = {
    value: {
      geometrie: { coordinates: [0, 0] }
    }
  };
  beforeEach(() => {
    renderedComponent = shallow(<MapDetail {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render correctly', () => {
    expect(renderedComponent).toMatchSnapshot();
  });
});
