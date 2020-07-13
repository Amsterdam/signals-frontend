import React from 'react';
import { shallow } from 'enzyme';

import TextAreaInput from '.';

describe('<TextAreaInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn(),
      rows: 2,
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
    const TextAreaInputRender = TextAreaInput(props);
    wrapper = shallow(
      <TextAreaInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render character counter correctly', () => {
    props.maxLength = 300;
    const TextAreaInputRender = TextAreaInput(props);
    wrapper = shallow(
      <TextAreaInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render character counter with value correctly', () => {
    props.maxLength = 300;
    props.value = 'test';
    const TextAreaInputRender = TextAreaInput(props);
    wrapper = shallow(
      <TextAreaInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
