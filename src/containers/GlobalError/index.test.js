import React from 'react';
import { shallow } from 'enzyme';

import { GlobalError } from './index';

describe('<GlobalError />', () => {
  describe('rendering', () => {
    it('should render showing no error by default', () => {
      const renderedComponent = shallow(
        <GlobalError />
      );
      expect(renderedComponent).toMatchSnapshot();
    });

    it('should render showing an error when defined', () => {
      const props = {
        error: true,
        errorMessage: 'MOCK_ERROR'
      };
      const renderedComponent = shallow(
        <GlobalError {...props} />
      );
      expect(renderedComponent).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should render showing no error by default', () => {
      const props = {
        error: true,
        errorMessage: 'MOCK_ERROR',
        onClose: jest.fn()
      };
      const renderedComponent = shallow(
        <GlobalError {...props} />
      );
      expect(renderedComponent).toMatchSnapshot();

      renderedComponent.find('button').simulate('click');
      expect(props.onClose).toHaveBeenCalled();
      expect(renderedComponent).toMatchSnapshot();
    });
  });
});
