import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import Footer from './index';

describe('<Footer />', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      withAppContext(<Footer />)
    );

    expect(getByText('Lukt het niet om een melding te doen?')).toBeInTheDocument();
    // @TODO
    expect(getByText('Bel het Gemeentelijk informatienummer: 14 020')).toBeInTheDocument();
    expect(getByText('op werkdagen van 08.00 tot 18.00 uur.')).toBeInTheDocument();

    expect(getByText('Privacy')).toBeInTheDocument();
  });
});
