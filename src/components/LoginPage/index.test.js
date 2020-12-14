import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import * as auth from 'shared/services/auth/auth';

import LoginPage from '.';

jest.mock('shared/services/auth/auth');

describe('components/LoginPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(withAppContext(<LoginPage />));

    expect(screen.getByText('Om deze pagina te zien dient u ingelogd te zijn.')).toBeInTheDocument();
    expect(screen.getByText('Inloggen')).toBeInTheDocument();
    expect(screen.getByText('Inloggen ADW')).toBeInTheDocument();
  });

  it('should login on datapunt when Inloggen button is clicked', () => {
    const loginSpy = jest.spyOn(auth, 'login');
    const { getByText } = render(withAppContext(<LoginPage />));
    const button = getByText('Inloggen').parentNode;

    expect(button.getAttribute('type')).toEqual('button');

    fireEvent.click(button);

    expect(loginSpy).toHaveBeenCalledWith('datapunt');
  });

  it('should login on datapunt when Inloggen ADW button is clicked', () => {
    const loginSpy = jest.spyOn(auth, 'login');
    render(withAppContext(<LoginPage />));
    const button = screen.getByText('Inloggen ADW').parentNode;

    expect(button.getAttribute('type')).toEqual('button');

    fireEvent.click(button);

    expect(loginSpy).toHaveBeenCalledWith('grip');
  });

  it('should login on keycloak when Inloggen Keycloak button is clicked', () => {
    const loginSpy = jest.spyOn(auth, 'login');
    render(withAppContext(<LoginPage />));
    const button = screen.getByText('Inloggen Keycloak').parentNode;

    expect(button.getAttribute('type')).toEqual('button');

    fireEvent.click(button);

    expect(loginSpy).toHaveBeenCalledWith('keycloak');
  });
});
