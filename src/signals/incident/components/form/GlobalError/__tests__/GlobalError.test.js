import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import GlobalError from '..';

describe('Form component <GlobalError />', () => {
  const props = {
    meta: {
      name: 'global',
      label: 'Error message',
    },
    parent: {
      touched: false,
      valid: false,
    },
  };

  describe('rendering', () => {
    it('does not render the error message initially', () => {
      render(withAppContext(<GlobalError {...props} />));

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument();
    });

    it('renders the error message when touched', () => {
      render(withAppContext(<GlobalError {...{ ...props, parent: { touched: true, valid: false } }} />));

      expect(screen.getByText(props.meta.label)).toBeInTheDocument();
    });

    it('renders a default error message', () => {
      const defaultErrorMessage =
        'Er zijn vragen niet (of niet juist) ingevuld. Vul de vragen hieronder op de goede manier in.';
      render(withAppContext(<GlobalError meta={{ name: 'global' }} parent={{ touched: true, valid: false }} />));

      expect(screen.getByText(defaultErrorMessage)).toBeInTheDocument();
    });

    it('does not render the error message when valid', () => {
      render(withAppContext(<GlobalError {...{ ...props, parent: { touched: false, valid: true } }} />));

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument();
    });

    it('does not render the error message when valid and touched', () => {
      render(withAppContext(<GlobalError {...{ ...props, parent: { touched: true, valid: true } }} />));

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument();
    });
  });
});
