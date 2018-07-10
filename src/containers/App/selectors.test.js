import { fromJS } from 'immutable';

import {
  selectGlobal,
  makeSelectUserName,
  makeSelectAccessToken,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
} from './selectors';

describe('selectGlobal', () => {
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
        accessToken
      }
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
    const error = 404;
    const mockedState = fromJS({
      global: {
        error,
      },
    });
    expect(errorSelector(mockedState)).toEqual(error);
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
