import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import 'jest-styled-components';
import Input from '..';

describe('src/components/Input', () => {
  const label = 'I am a label';
  const hint = 'Take a hint?';

  it('should should render a label', () => {
    const { queryByText, getByText, rerender } = render(withAppContext(<Input id="392867y23uhi4" />));

    expect(queryByText(label)).toBeNull();

    rerender(withAppContext(<Input id="392867y23uhi4" label={label} />));

    expect(getByText(label)).toBeInTheDocument();
  });

  it('should should render hint text', () => {
    const { queryByText, getByText, rerender } = render(withAppContext(<Input id="392867y23uhi4" />));

    expect(queryByText(hint)).toBeNull();

    rerender(withAppContext(<Input id="392867y23uhi4" hint={hint} />));

    expect(getByText(hint)).toBeInTheDocument();
  });
});
