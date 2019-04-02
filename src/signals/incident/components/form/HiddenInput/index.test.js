import React from 'react';
import { shallow } from 'enzyme';

import HiddenInput from './index';

describe('Form component <HiddenInput />', () => {
  let wrapper;
  let handler;

  beforeEach(() => {
    handler = jest.fn();

    wrapper = shallow(<HiddenInput
      handler={handler}
    />);
  });

  describe('rendering', () => {
    it('should render hidden field correctly', () => {
      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
