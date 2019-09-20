import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import TextInput from '../';

describe('<TextInput />', () => {
  afterEach(cleanup);

  it('should render correctly', () => {
    const props = {
      name: 'my_input',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn(),
    };

    const TextInputRender = TextInput(props);
    const { container } = render(
      withAppContext(<TextInputRender {...props} />),
    );

    expect(container.firstChild.querySelector('input[type="text"][id="formmy_input"]')).toBeTruthy();
    expect(container.firstChild.querySelector('label[for="formmy_input"]')).toBeTruthy();
  });
});
