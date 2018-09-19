import React from 'react';
import { shallow } from 'enzyme';

import TextAreaInput from './index';

describe('<TextAreaInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn(),
      rows: 2
    };

    const TextAreaInputRender = TextAreaInput(props);
    wrapper = shallow(
      <TextAreaInputRender {...props} />
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

