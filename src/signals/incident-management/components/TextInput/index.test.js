import React from 'react';
import { shallow } from 'enzyme';

import TextInput from './index';

describe('<TextInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn()
    };

    const TextInputRender = TextInput(props);
    wrapper = shallow(
      <TextInputRender {...props} />
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

