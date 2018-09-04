import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import DatePickerInput from './index';

describe('<DatePickerInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      setValue: jest.fn(),
      value: moment('2000-01-01')
    };

    const DatePickerInputRender = DatePickerInput(props);
    wrapper = shallow(
      <DatePickerInputRender {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper).toMatchSnapshot();
  });
});

