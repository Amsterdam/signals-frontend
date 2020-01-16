import React from 'react';
import { mount } from 'enzyme';
import { render, cleanup, act } from '@testing-library/react';
import { withAppContext, history } from 'test/utils';
import * as auth from 'shared/services/auth/auth';
import App, { AppContainer, mapDispatchToProps } from './index';
import { REQUEST_CATEGORIES } from './constants';

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

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<App />));

    const props = tree.find(AppContainer).props();

    expect(props.requestCategoriesAction).not.toBeUndefined();
  });

  it('should scroll to top on history change', () => {
    render(
      withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
    );

    expect(spyScrollTo).not.toHaveBeenCalled();

    act(() => {
      history.push('/somewhere/else');
    });

    expect(spyScrollTo).not.toHaveBeenCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
    });
  });


  it('should render correctly', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => false);

    const { getByTestId, queryByTestId, rerender } = render(
      withAppContext(<AppContainer requestCategoriesAction={() => {}} />),
    );

    expect(getByTestId('siteFooter')).toBeInTheDocument();
    expect(getByTestId('siteHeader')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => true);

    cleanup();

    rerender(
      withAppContext(<AppContainer requestCategoriesAction={() => {}} />),
    );

    expect(queryByTestId('siteFooter')).not.toBeInTheDocument();
  });

  it('should render the correct theme', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { queryByTestId, rerender } = render(
      withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
    );

    expect(queryByTestId('signalsThemeProvider')).not.toBeNull();

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(
      withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
    );

    expect(queryByTestId('signalsThemeProvider')).toBeNull();
  });

  describe('routing', () => {
    it('should redirect from "/" to "/incident/beschrijf"', () => {
      history.push('/');

      render(
        withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
      );

      expect(history.location.pathname).toEqual('/incident/beschrijf');
    });

    it('should redirect from "/login" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      render(
        withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
      );

      act(() => {
        history.push('/login');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');

      cleanup();

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      render(
        withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
      );

      act(() => {
        history.push('/login');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');
    });

    it('should redirect from "/manage" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      render(
        withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
      );

      act(() => {
        history.push('/manage');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');

      cleanup();

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      render(
        withAppContext(<AppContainer requestCategoriesAction={() => { }} />),
      );

      act(() => {
        history.push('/manage');
      });

      expect(history.location.pathname).toEqual('/manage/incidents');
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      // For the `mapDispatchToProps`, call it directly but pass in
      // a mock function and check the arguments passed in are as expected
      mapDispatchToProps(dispatch).requestCategoriesAction();
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_CATEGORIES });
    });
  });
});
