import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import TextArea from '..';

describe('components/TextArea', () => {
  it('renders correctly', () => {
    const { container } = render(withAppContext(<TextArea cols={40} rows={5} className="txtArea" />));
    expect(container.querySelector('textarea[cols="40"][rows="5"].txtArea')).toBeTruthy();
  });

  it('renders the info text', () => {
    render(
      withAppContext(<TextArea cols={40} rows={5} infoText="You have entered 0/10 characters" />)
    );

    expect(screen.getByText('You have entered 0/10 characters')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(withAppContext(<TextArea label="Notitie" />));

    expect(screen.getByText('Notitie')).toBeInTheDocument();
  });
});
