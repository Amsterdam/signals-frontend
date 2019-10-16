import React from 'react';
import { shallow } from 'enzyme';

import PlainText from './index';

describe('Preview component <PlainText />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlainText />);
  });

  it('should render text correctly', () => {
    wrapper.setProps({
      label: 'Title',
      value: 'Plain text',
    });

    expect(wrapper).toMatchSnapshot();
  });
});
