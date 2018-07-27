import React from 'react';
import { shallow } from 'enzyme';

import TextInput from './index';

describe('<TextInput />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn()
    };

    const TextInputRender = TextInput(props);
    renderedComponent = shallow(
      <TextInputRender {...props} />
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

