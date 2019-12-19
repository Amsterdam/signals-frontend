import { fromJS } from 'immutable';
import { initialState } from './reducer';

import {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectNotification,
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
