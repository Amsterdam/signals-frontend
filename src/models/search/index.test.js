import injectReducerModel from 'utils/injectReducerModel';

import reducer from './reducer';

import loadModel from './index';

jest.mock('utils/injectReducerModel');

jest.mock('./reducer');

describe('loadModel', () => {
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

    expect(spy).toHaveBeenCalledWith('incidentModel', reducer, store);
  });
});
