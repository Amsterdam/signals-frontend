import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import DatePickerInput from './index';

describe('<DatePickerInput />', () => {
  let renderedComponent;
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
    renderedComponent = shallow(
      <DatePickerInputRender {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(renderedComponent).not.toBeNull();
    expect(renderedComponent).toMatchSnapshot();
  });
});

