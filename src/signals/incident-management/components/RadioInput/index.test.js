import React from 'react';
import { shallow } from 'enzyme';

import RadioInput from './index';

describe('<RadioInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { key: '', value: 'none' },
        { key: '1', value: 'item1' },
        { key: '2', value: 'item2' },
      ],
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const RadioInputRender = RadioInput(props);
    wrapper = shallow(
      <RadioInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
