import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import  Button  from '..';

describe('src/components/Button', () => {
  it('should render correctly', () => {
    const buttonText = 'buttonText';
    const { container, getByText } = render(
      withAppContext(<Button>{buttonText}</Button>)
    );

    expect(getByText(buttonText)).toBeInTheDocument();

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });
});
