import React from 'react';
import { render, screen } from '@testing-library/react';
import { Validators } from 'react-reactive-form';

import { withAppContext } from 'test/utils';
import { createRequired } from '../../../services/custom-validators';

import Header from '.';

describe('signals/incident/components/form/Header', () => {
  it('should render label', () => {
    const label = 'Foo barrrr';
    render(withAppContext(<Header hasError={() => {}} meta={{ label }} />));

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should render optional indicator', () => {
    const label = 'Zork';
    const { rerender } = render(withAppContext(<Header hasError={() => {}} meta={{ label }} options={{}} />));

    expect(screen.queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header hasError={() => {}} meta={{ label }} options={{ validators: undefined }} />));

    expect(screen.queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header hasError={() => {}} meta={{ label }} options={{ validators: [] }} />));

    expect(screen.queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header hasError={() => {}} options={{}} />));

    expect(screen.queryByText('(optioneel)')).not.toBeInTheDocument();

    rerender(
      withAppContext(<Header hasError={() => {}} meta={{ label }} options={{ validators: [Validators.required] }} />)
    );

    expect(screen.queryByText('(optioneel)')).not.toBeInTheDocument();

    rerender(
      withAppContext(
        <Header hasError={() => {}} meta={{ label }} options={{ validators: [createRequired('Verplicht')] }} />
      )
    );

    expect(screen.queryByText('(optioneel)')).not.toBeInTheDocument();
  });

  it('should render subtitle', () => {
    const subtitle = 'Bar bazzz';
    render(withAppContext(<Header hasError={() => {}} meta={{ subtitle }} />));

    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('should render children', () => {
    const { container } = render(
      withAppContext(
        <Header hasError={() => {}}>
          <span className="child" />
        </Header>
      )
    );

    expect(container.querySelector('.child')).toBeInTheDocument();
  });

  it('should render required error with default message', () => {
    const hasError = prop => prop === 'required';
    const error = 'Dit is een verplicht veld';

    const { rerender } = render(withAppContext(<Header hasError={() => false} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header getError={() => {}} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render required error with custom message', () => {
    const error = 'Dit is een custom verplicht veld';
    const hasError = prop => prop === 'required';
    const getError = () => error;

    const { rerender } = render(withAppContext(<Header hasError={() => false} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header getError={getError} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render email error', () => {
    const hasError = prop => prop === 'email';
    const error = 'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl';

    const { rerender } = render(withAppContext(<Header hasError={() => false} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render maxLength error', () => {
    const requiredLength = 300;
    const hasError = prop => prop === 'maxLength';
    const getError = () => ({ requiredLength });
    const error = `U heeft meer dan de maximale ${requiredLength} tekens ingevoerd`;

    const { rerender } = render(withAppContext(<Header hasError={() => false} getError={getError} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} getError={getError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render custom error', () => {
    const error = 'Hic sunt dracones';
    const hasError = prop => prop === 'custom';
    const getError = () => error;

    const { rerender } = render(withAppContext(<Header hasError={() => false} getError={getError} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} getError={getError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should not render error when not touched', () => {
    const hasError = prop => prop === 'required';
    const touched = false;
    const error = 'Dit is een verplicht veld';

    const { rerender } = render(withAppContext(<Header hasError={hasError} touched={touched} />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header getError={() => {}} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });
});
