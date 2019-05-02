import React from 'react';
import { shallow } from 'enzyme';

import Header from './index';

describe('Form component <Header />', () => {
  let wrapper;
  let meta;
  let options;
  let touched;
  let getError;
  let hasError;

  beforeEach(() => {
    meta = {
      label: 'naam'
    };
    options = {};
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();

    wrapper = shallow(<Header
      meta={meta}
      options={options}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when label is not available', () => {
    wrapper.setProps({
      meta: {
        label: null
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  describe('error messages', () => {
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

    it('should render custom error', () => {
      hasError.mockImplementation((type) => type === 'custom');
      getError.mockImplementation(() => 'custom error message');
      wrapper.setProps({ touched: true });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render optional field message', () => {
      wrapper.setProps({ options: { validators: [] } });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
