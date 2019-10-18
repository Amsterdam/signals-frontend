import injectReducerModel from 'utils/injectReducerModel';

import reducer from '../reducer';
import loadModel from '../';

jest.mock('utils/injectReducerModel');

jest.mock('../reducer');

describe('loadModel search', () => {
  const store = { foo: 'bar' };
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should inject reducer', () => {
    injectReducerModel.mockImplementation(spy);
    loadModel(store);

    expect(spy).toHaveBeenCalledWith('search', reducer, store);
  });
});
