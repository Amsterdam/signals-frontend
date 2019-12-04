import { fromJS } from 'immutable';
import { initialState } from './reducer';

import {
  selectGlobal,
  makeSelectUserName,
  makeSelectAccessToken,
  makeSelectLoading,
  makeSelectError,
  makeSelectNotification,
  makeSelectLocation,
  makeSelectIsAuthenticated,
  makeSelectCategories,
} from './selectors';

describe('selectGlobal', () => {
  it('should return the initialState', () => {
    expect(selectGlobal()).toEqual(initialState);
  });

  it('should select the global state', () => {
    const globalState = fromJS({});
    const mockedState = fromJS({
      global: globalState,
    });
    expect(selectGlobal(mockedState)).toEqual(globalState);
  });
});

describe('makeSelectUserName', () => {
  const userNameSelector = makeSelectUserName();
  it('should select the current user', () => {
    const username = 'loggedInUser';
    const mockedState = fromJS({
      global: {
        userName: username,
      },
    });
    expect(userNameSelector(mockedState)).toEqual(username);
  });
});

describe('makeSelectAccessToken', () => {
  const selector = makeSelectAccessToken();
  it('should select the token', () => {
    const accessToken = 'thisistheaccesstoken';
    const mockedState = fromJS({
      global: {
        accessToken,
      },
    });
    expect(selector(mockedState)).toEqual(accessToken);
  });
});

describe('makeSelectLoading', () => {
  const loadingSelector = makeSelectLoading();
  it('should select the loading', () => {
    const loading = false;
    const mockedState = fromJS({
      global: {
        loading,
      },
    });
    expect(loadingSelector(mockedState)).toEqual(loading);
  });
});

describe('makeSelectError', () => {
  const errorSelector = makeSelectError();
  it('should select the error', () => {
    const error = true;
    const mockedState = fromJS({
      global: {
        error,
      },
    });
    expect(errorSelector(mockedState)).toEqual(error);
  });
});

describe('makeSelectNotification', () => {
  const notificationSelector = makeSelectNotification();

  it('should select the notification', () => {
    const notification = {
      title: 'Foo bar',
      message: 'Qux',
      type: 'error',
      variant: 'global',
    };

    const mockedState = fromJS({
      global: {
        notification,
      },
    });

    expect(notificationSelector(mockedState)).toEqual(notification);
  });
});

describe('makeSelectLocation', () => {
  const locationStateSelector = makeSelectLocation();
  it('should select the location', () => {
    const route = fromJS({
      location: { pathname: '/foo' },
    });
    const mockedState = fromJS({
      route,
    });
    expect(locationStateSelector(mockedState)).toEqual(route.get('location').toJS());
  });
});

describe('makeSelectIsAuthenticated', () => {
  const isAuthenticatedStateSelector = makeSelectIsAuthenticated();
  it('should select the login state', () => {
    const accessToken = 'thisistheaccesstoken';
    const mockedState = fromJS({
      global: {
        accessToken,
      },
    });
    expect(isAuthenticatedStateSelector(mockedState)).toEqual(true);
  });
});

describe('makeSelectCategories', () => {
  const selector = makeSelectCategories();
  it('should select the login state', () => {
    const categories = {
      main: [1, 2],
      sub: [3, 4],
    };
    const mockedState = fromJS({
      global: {
        categories,
      },
    });
    expect(selector(mockedState)).toEqual(categories);
  });
});
