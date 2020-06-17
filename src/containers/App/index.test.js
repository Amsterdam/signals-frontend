import React from 'react';
import { render, act } from '@testing-library/react';
import { withAppContext, history } from 'test/utils';
import * as auth from 'shared/services/auth/auth';
import App, { AppContainer } from './index';

jest.mock('signals/incident/components/IncidentWizard', () => () => <span />);
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

  it('should call authenticate', () => {
    jest.spyOn(auth, 'authenticate');

    expect(auth.authenticate).not.toHaveBeenCalled();

    render(
      withAppContext(<App />),
    );

    expect(auth.authenticate).toHaveBeenCalled();
  });

  it('should scroll to top on history change', () => {
    render(
      withAppContext(<App />),
    );

    expect(spyScrollTo).not.toHaveBeenCalled();

    act(() => {
      history.push('/somewhere/else');
    });

    expect(spyScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should reset incident on page unload', () => {
    act(() => {
      history.push('/');
    });

    const resetIncidentAction = jest.fn();

    const { rerender, unmount } = render(withAppContext(<AppContainer resetIncidentAction={resetIncidentAction} />));

    expect(resetIncidentAction).not.toHaveBeenCalled();

    act(() => {
      history.push('/incident/bedankt');
    });

    unmount();

    rerender(withAppContext(<AppContainer resetIncidentAction={resetIncidentAction} />));

    expect(resetIncidentAction).not.toHaveBeenCalled();

    act(() => {
      history.push('/');
    });

    unmount();

    rerender(withAppContext(<AppContainer resetIncidentAction={resetIncidentAction} />));

    expect(resetIncidentAction).toHaveBeenCalled();
  });

  it('should render correctly', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => false);

    const { getByTestId, queryByTestId, rerender, unmount } = render(
      withAppContext(<App />),
    );

    expect(getByTestId('siteFooter')).toBeInTheDocument();
    expect(getByTestId('siteHeader')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => true);

    unmount();

    rerender(
      withAppContext(<App />),
    );

    expect(queryByTestId('siteFooter')).not.toBeInTheDocument();
  });

  describe('routing', () => {
    it('should redirect from "/" to "/incident/beschrijf"', () => {
      render(
        withAppContext(<App />),
      );

      act(() => {
        history.push('/');
      });

      expect(history.location.pathname).toEqual('/incident/beschrijf');
    });

    it('should redirect from "/login" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      const { rerender, unmount } = render(
        withAppContext(<App />),
      );

      act(() => {
        history.push('/login');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');

      unmount();

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      rerender(
        withAppContext(<App />),
      );

      act(() => {
        history.push('/login');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');
    });

    it('should redirect from "/manage" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      const { rerender, unmount } = render(
        withAppContext(<App />),
      );

      act(() => {
        history.push('/manage');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');

      unmount();

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      rerender(
        withAppContext(<App />),
      );

      act(() => {
        history.push('/manage');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');
    });
  });
});
