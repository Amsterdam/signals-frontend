import getInjectorsReducer from 'utils/reducerInjectors';

import injectReducerModel from '../injectReducerModel';

jest.mock('utils/reducerInjectors');

describe('injectReducerModel', () => {
  const mockReducer = jest.fn();
  const store = { foo: 'bar' };

  it('should inject model into reducer', () => {
    const spy = jest.fn();

    getInjectorsReducer.mockImplementation(() => ({
      injectReducer: spy
    }));
    injectReducerModel('mockKey', mockReducer, store);

    expect(getInjectorsReducer).toHaveBeenCalledWith(store);
    expect(spy).toHaveBeenCalledWith('mockKey', mockReducer);

    jest.resetAllMocks();
  });
});
