import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import Error from '..';

describe('Form component <Error />', () => {
  const props = {
    meta: {
      label: 'Error message',
    },
    parent: {
      touched: false,
      valid: false,
    },
  };

  describe('rendering', () => {
    it('does not render the error message initially', () => {
      render(withAppContext(<Error {...props} />));

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument();
    });

    it('renders the error message when touched', () => {
      render(withAppContext(<Error {...{ ...props, parent: { touched: true, valid: false } }} />));

      expect(screen.getByText(props.meta.label)).toBeInTheDocument();
    });

    it('does not render the error message when valid', () => {
      render(withAppContext(<Error {...{ ...props, parent: { touched: false, valid: true } }} />));

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument();
    });

    it('does not render the error message when valid and touched', () => {
      render(withAppContext(<Error {...{ ...props, parent: { touched: true, valid: true } }} />));

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument();
    });
  });
});
