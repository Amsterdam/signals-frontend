import React from 'react';
import { shallow } from 'enzyme';
import getMessage from './services/get-message';

import { GlobalError, mapDispatchToProps } from './index';
import { RESET_GLOBAL_ERROR } from '../App/constants';

jest.mock('./services/get-message');

describe('<GlobalError />', () => {
  beforeEach(() => {
    getMessage.mockImplementation(() => 'An error message.');
  });

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
        errorMessage: 'MOCK_ERROR',
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
        onClose: jest.fn(),
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

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should close the error', () => {
      mapDispatchToProps(dispatch).onClose();
      expect(dispatch).toHaveBeenCalledWith({ type: RESET_GLOBAL_ERROR });
    });
  });
});
