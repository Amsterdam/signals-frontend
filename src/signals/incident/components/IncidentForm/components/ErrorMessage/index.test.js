import React from 'react';
import { shallow } from 'enzyme';

import ErrorMessage from './index';

describe('Form component <ErrorMessage />', () => {
  let wrapper;
  let touched;
  let getError;
  let hasError;

  beforeEach(() => {
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();

    wrapper = shallow(<ErrorMessage
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render no error by default', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no error when element is only touched', () => {
      wrapper.setProps({ touched: true });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render required error', () => {
      hasError.mockImplementation((type) => type === 'required');
      wrapper.setProps({ touched: true });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render email error', () => {
      hasError.mockImplementation((type) => type === 'email');
      wrapper.setProps({ touched: true });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render maxLength error', () => {
      hasError.mockImplementation((type) => type === 'maxLength');
      getError.mockImplementation(() => ({
        requiredLength: 666
      }));
      wrapper.setProps({ touched: true });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
