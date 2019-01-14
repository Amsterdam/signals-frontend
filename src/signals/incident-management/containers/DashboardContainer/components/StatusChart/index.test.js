import React from 'react';
import { shallow } from 'enzyme';

import StatusChart from './index';

describe('<StatusChart />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      data: [
        { name: 'Gemeld', count: 57, color: '#23B0C3' },
        { name: 'In afhandeling van behandeling', count: 7, color: '#E8663F' },
        { name: 'In behandeling', count: 20, color: '#FE952F' },
        { name: 'Geannuleerd', count: 2, color: '#96C14F' },
        { name: 'Afgehandeld', count: 13, color: '#9B4474' },
        { name: 'On hold', count: 1, color: '#E8663F' }
      ]
    };

    wrapper = shallow(
      <StatusChart {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
