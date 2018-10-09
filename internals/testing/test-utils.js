export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload
  };
  expect(action(payload)).toEqual(expected);
};

export const getContext = (state) => {
  const store = {
    dispatch: jest.fn(),
    getState: () => state,
    replaceReducer: jest.fn(),
    runSaga: jest.fn(),
    subscribe: jest.fn(),
    injectedReducers: {},
    injectedSagas: {}
  };

  return { store };
};
