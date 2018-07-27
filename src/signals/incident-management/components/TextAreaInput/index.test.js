import React from 'react';
import { shallow } from 'enzyme';

import TextAreaInput from './index';

describe('<TextAreaInput />', () => {
  let renderedComponent;
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
    renderedComponent = shallow(
      <TextAreaInputRender {...props} />
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

