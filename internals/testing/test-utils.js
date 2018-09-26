import configureStore from 'redux-mock-store';

export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload
  };
  expect(action(payload)).toEqual(expected);
};

export const mockStore = (state) => {
  const store = configureStore()(state);

  store.runSaga = jest.fn();
  store.injectedReducers = {};
  store.injectedSagas = {};

  return store;
};
