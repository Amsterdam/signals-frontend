import React from 'react';
import { render, screen } from '@testing-library/react';
import { Validators } from 'react-reactive-form';

import { withAppContext } from 'test/utils';
import { createRequired } from '../../../../services/custom-validators';

import type { HeaderProps } from '..';
import Header from '..';
import type { FormMeta } from 'types/reactive-form';

describe('signals/incident/components/form/Header', () => {
  const label = 'Foo barrrr';
  const props = {
    meta: {
      label,
      name: label,
      updateIncident: () => {},
    } as FormMeta,
    touched: false,
    hasError: () => false,
    getError: () => '',
  } as HeaderProps;

  it('should render label', () => {
    render(withAppContext(<Header {...props} />));

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should render optional indicator', () => {
    const { rerender } = render(withAppContext(<Header {...props} options={{}} />));

    expect(screen.queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header {...props} options={{ validators: undefined }} />));

    expect(screen.queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header {...props} options={{ validators: [] }} />));

    expect(screen.queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header {...props} meta={{ ...props.meta, label: undefined }} options={{}} />));

    expect(screen.queryByText('(optioneel)')).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} options={{ validators: [Validators.required] }} />));

    expect(screen.queryByText('(optioneel)')).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} options={{ validators: [createRequired('Verplicht')] }} />));

    expect(screen.queryByText('(optioneel)')).not.toBeInTheDocument();
  });

  it('should render subtitle', () => {
    const subtitle = 'Bar bazzz';
    render(withAppContext(<Header {...props} meta={{ ...props.meta, subtitle }} />));

    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('should render children', () => {
    const { container } = render(
      withAppContext(
        <Header {...props}>
          <span className="child" />
        </Header>
      )
    );

    expect(container.querySelector('.child')).toBeInTheDocument();
  });

  it('should render required error with default message', () => {
    const hasError = (prop: string) => prop === 'required';
    const getError = () => true;
    const error = 'Dit is een verplicht veld';

    const { rerender } = render(withAppContext(<Header {...props} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} getError={getError} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render required error with custom message', () => {
    const error = 'Dit is een custom verplicht veld';
    const hasError = (prop: string) => prop === 'required';
    const getError = () => error;

    const { rerender } = render(withAppContext(<Header {...props} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} getError={getError} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render email error', () => {
    const hasError = (prop: string) => prop === 'email';
    const error = 'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl';

    const { rerender } = render(withAppContext(<Header {...props} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render maxLength error', () => {
    const requiredLength = 300;
    const hasError = (prop: string) => prop === 'maxLength';
    const getError = () => ({ requiredLength });
    const error = `U heeft meer dan de maximale ${requiredLength} tekens ingevoerd`;

    const { rerender } = render(withAppContext(<Header {...props} getError={getError} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} hasError={hasError} getError={getError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should render custom error', () => {
    const error = 'Hic sunt dracones';
    const hasError = (prop: string) => prop === 'custom';
    const getError = () => error;

    const { rerender } = render(withAppContext(<Header {...props} getError={getError} touched />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} hasError={hasError} getError={getError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });

  it('should not render error when not touched', () => {
    const hasError = (prop: string) => prop === 'required';
    const getError = () => true;
    const touched = false;
    const error = 'Dit is een verplicht veld';

    const { rerender } = render(withAppContext(<Header {...props} hasError={hasError} touched={touched} />));

    expect(screen.queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header {...props} getError={getError} hasError={hasError} touched />));

    expect(screen.queryByText(error)).toBeInTheDocument();
  });
});
