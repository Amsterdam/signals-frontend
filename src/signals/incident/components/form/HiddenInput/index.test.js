import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import HiddenInput from './index';

describe('Form component <HiddenInput />', () => {
  it('renders a hidden input element', () => {
    const handler = () => ({ value: 'foo', name: 'bar' });
    const { container } = render(withAppContext(<HiddenInput handler={handler} />));

    expect(container.querySelector('input[type="hidden"]')).toBeInTheDocument();
  });


  it('renders nothing', () => {
    const { container, rerender } = render(withAppContext(<HiddenInput handler={() => ({ value: 'foo' })} />));

    expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();

    rerender(withAppContext(<HiddenInput handler={() => ({ name: 'bar' })} />));

    expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();
  });
});
