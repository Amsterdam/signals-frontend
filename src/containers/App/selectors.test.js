import {
  selectGlobal,
  makeSelectUserName,
  makeSelectAccessToken,
  makeSelectLoading,
  makeSelectError,
  makeSelectErrorMessage,
  makeSelectLocation,
  makeSelectIsAuthenticated,
  makeSelectCategories
} from './selectors';

describe('selectGlobal', () => {
  it('should select the global state', () => {
    const globalState = {};
    const mockedState = {
      global: globalState,
    };
    expect(selectGlobal(mockedState)).toEqual(globalState);
  });
});

describe('makeSelectUserName', () => {
  const userNameSelector = makeSelectUserName();
  it('should select the current user', () => {
    const username = 'loggedInUser';
    const mockedState = {
      global: {
        userName: username,
      },
    };
    expect(userNameSelector(mockedState)).toEqual(username);
  });
});

describe('makeSelectAccessToken', () => {
  const selector = makeSelectAccessToken();
  it('should select the token', () => {
    const accessToken = 'thisistheaccesstoken';
    const mockedState = {
      global: {
        accessToken
      }
    };
    expect(selector(mockedState)).toEqual(accessToken);
  });
});

describe('makeSelectLoading', () => {
  const loadingSelector = makeSelectLoading();
  it('should select the loading', () => {
    const loading = false;
    const mockedState = {
      global: {
        loading,
      },
    };
    expect(loadingSelector(mockedState)).toEqual(loading);
  });
});

describe('makeSelectError', () => {
  const errorSelector = makeSelectError();
  it('should select the error', () => {
    const error = true;
    const mockedState = {
      global: {
        error
      },
    };
    expect(errorSelector(mockedState)).toEqual(error);
  });
});

describe('makeSelectErrorMessage', () => {
  const errorMessageSelector = makeSelectErrorMessage();
  it('should select the error message', () => {
    const errorMessage = 'ERROR_MESSAGE';
    const mockedState = {
      global: {
        errorMessage,
      },
    };
    expect(errorMessageSelector(mockedState)).toEqual(errorMessage);
  });
});

describe('makeSelectLocation', () => {
  const locationStateSelector = makeSelectLocation();
  it('should select the location', () => {
    const route = {
      location: { pathname: '/foo' },
    };
    const mockedState = {
      route,
    };
    expect(locationStateSelector(mockedState)).toEqual(route.location);
  });
});

describe('makeSelectIsAuthenticated', () => {
  const isAuthenticatedStateSelector = makeSelectIsAuthenticated();
  it('should select the login state', () => {
    const accessToken = 'thisistheaccesstoken';
    const mockedState = {
      global: {
        accessToken
      }
    };
    expect(isAuthenticatedStateSelector(mockedState)).toEqual(true);
  });
});

describe('makeSelectCategories', () => {
  const selector = makeSelectCategories();
  it('should select the login state', () => {
    const categories = {
      main: [1, 2],
      sub: [3, 4]
    };
    const mockedState = {
      global: {
        categories
      }
    };
    expect(selector(mockedState)).toEqual(categories);
  });
});
