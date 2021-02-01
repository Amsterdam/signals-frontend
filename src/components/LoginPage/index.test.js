import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';
import * as auth from 'shared/services/auth/auth';
import LoginPage from '.';

jest.mock('shared/services/configuration/configuration');
jest.mock('shared/services/auth/auth');

describe('components/LoginPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
    configuration.__reset();
  });

  it('should render correctly', () => {
    configuration.keycloak = {};
    render(withAppContext(<LoginPage />));

    expect(screen.getByText('Om deze pagina te zien dient u ingelogd te zijn.')).toBeInTheDocument();
    expect(screen.getByText('Inloggen')).toBeInTheDocument();
    expect(screen.getByText('Inloggen ADW')).toBeInTheDocument();
  });

  it('should render correctly without Keycloak', () => {
    render(withAppContext(<LoginPage />));

    expect(screen.queryByText('Inloggen ADW')).not.toBeInTheDocument();
  });

  it('should login on datapunt when Inloggen button is clicked', () => {
    const loginSpy = jest.spyOn(auth, 'login');
    const { getByText } = render(withAppContext(<LoginPage />));
    const button = getByText('Inloggen').parentNode;

    expect(button.getAttribute('type')).toEqual('button');

    fireEvent.click(button);

    expect(loginSpy).toHaveBeenCalledWith('datapunt');
  });

  it('should login on keycloak when Inloggen ADW button is clicked', () => {
    configuration.keycloak = {};
    const loginSpy = jest.spyOn(auth, 'login');
    render(withAppContext(<LoginPage />));
    const button = screen.getByText('Inloggen ADW').parentNode;

    expect(button.getAttribute('type')).toEqual('button');

    fireEvent.click(button);

    expect(loginSpy).toHaveBeenCalledWith('keycloak');
  });
});
