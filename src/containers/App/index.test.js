import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { withAppContext, history } from 'test/utils';
import * as auth from 'shared/services/auth/auth';
import { AppContainer } from './index';

jest.mock('components/MapInteractive');
jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}));

jest.useFakeTimers();

describe('<App />', () => {
  let listenSpy;
  let spyScrollTo;

  beforeEach(() => {
    spyScrollTo = jest.fn();
    Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo });
    listenSpy = jest.spyOn(history, 'listen');
  });

  afterEach(() => {
    listenSpy.mockRestore();
  });

  it('should scroll to top on history change', () => {
    render(
      withAppContext(<AppContainer />),
    );

    expect(spyScrollTo).not.toHaveBeenCalled();

    act(() => {
      history.push('/somewhere/else');
    });

    expect(spyScrollTo).toHaveBeenCalledWith(0, 0);
  });


  it('should render correctly', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => false);

    const { getByTestId, queryByTestId, rerender } = render(
      withAppContext(<AppContainer />),
    );

    expect(getByTestId('siteFooter')).toBeInTheDocument();
    expect(getByTestId('siteHeader')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => true);

    cleanup();

    rerender(
      withAppContext(<AppContainer />),
    );

    expect(queryByTestId('siteFooter')).not.toBeInTheDocument();
  });

  it('should render the correct theme', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { queryByTestId, rerender } = render(
      withAppContext(<AppContainer />),
    );

    expect(queryByTestId('signalsThemeProvider')).not.toBeNull();

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(
      withAppContext(<AppContainer />),
    );

    expect(queryByTestId('signalsThemeProvider')).toBeNull();
  });

  describe('routing', () => {
    it('should redirect from "/" to "/incident/beschrijf"', () => {
      render(
        withAppContext(<AppContainer />),
      );

      act(() => {
        history.push('/');
      });

      expect(history.location.pathname).toEqual('/incident/beschrijf');
    });

    it('should redirect from "/login" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      render(
        withAppContext(<AppContainer />),
      );

      act(() => {
        history.push('/login');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');

      cleanup();

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      render(
        withAppContext(<AppContainer />),
      );

      act(() => {
        history.push('/login');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');
    });

    it('should redirect from "/manage" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      render(
        withAppContext(<AppContainer />),
      );

      act(() => {
        history.push('/manage');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');

      cleanup();

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      render(
        withAppContext(<AppContainer />),
      );

      act(() => {
        history.push('/manage');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');
    });
  });
});
