import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { withAppContext } from 'test/utils';

import DatePickerInput from '../index';

describe('<DatePickerInput />', () => {
  const props = {
    name: 'name',
    display: 'display',
    handler: jest.fn(),
    setValue: jest.fn(),
    value: moment('2000-01-01'),
  };
  let wrapper;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const DatePickerInputRender = DatePickerInput(props);
      const { container } = render(withAppContext(<DatePickerInputRender {...props} />));

      expect(container.firstChild.querySelector('button')).toBeTruthy();
    });

    it('should render correctly with no value', () => {
      const DatePickerInputRender = DatePickerInput(props);
      const { container } = render(withAppContext(<DatePickerInputRender {...props} value={undefined} />));

      expect(container.firstChild.querySelector('button')).toBeFalsy();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      const DatePickerInputRender = DatePickerInput(props);
      wrapper = shallow(<DatePickerInputRender {...props} />);
    });

    it('should set new value when changed', () => {
      wrapper.find(DatePicker).simulate('change', '1970-07-21');
      expect(props.setValue).toHaveBeenCalledWith('1970-07-21');
    });

    it('should set new value when changed into empty value', () => {
      wrapper.find(DatePicker).simulate('change');
      expect(props.setValue).toHaveBeenCalledWith('');
    });
  });
});
