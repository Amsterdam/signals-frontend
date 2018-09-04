import React from 'react';
import { shallow } from 'enzyme';

import Title from './index';

describe('Form component <Title />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Title />);
  });

  it('should render correctly', () => {
    wrapper.setProps({
      meta: {
        label: 'Title'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });
});
