import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';

import reducer from '../reducer';
import saga from '../saga';

import loadModel from '../index';

jest.mock('utils/injectReducerModel');
jest.mock('utils/injectSagaModel');

jest.mock('../reducer');
jest.mock('../saga');

describe('models/categories', () => {
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

    expect(spy).toHaveBeenCalledWith('categories', reducer, store);
  });

  it('should inject saga', () => {
    injectSagaModel.mockImplementation(spy);
    loadModel(store);

    expect(spy).toHaveBeenCalledWith('categories', saga, store);
  });
});
