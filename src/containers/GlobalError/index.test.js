import React from 'react';
import { shallow } from 'enzyme';

import { GlobalError } from './index';

describe('<GlobalError />', () => {
  describe('rendering', () => {
    it('should render showing no error by default', () => {
      const wrapper = shallow(
        <GlobalError />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render showing an error when defined', () => {
      const props = {
        error: true,
        errorMessage: 'MOCK_ERROR'
      };
      const wrapper = shallow(
        <GlobalError {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should render showing no error by default', () => {
      const props = {
        error: true,
        errorMessage: 'MOCK_ERROR',
        onClose: jest.fn()
      };
      const wrapper = shallow(
        <GlobalError {...props} />
      );
      expect(wrapper).toMatchSnapshot();

      wrapper.find('button').simulate('click');
      expect(props.onClose).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
