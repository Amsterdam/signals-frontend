import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';

import reducer from './reducer';
import saga from './saga';

import loadModel from './services';

jest.mock('utils/injectReducerModel');
jest.mock('utils/injectSagaModel');

jest.mock('./reducer');
jest.mock('./saga');

describe('containers/App/services', () => {
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

    expect(spy).toHaveBeenCalledWith('global', reducer, store);
  });

  it('should inject saga', () => {
    injectSagaModel.mockImplementation(spy);
    loadModel(store);

    expect(spy).toHaveBeenCalledWith('global', saga, store);
  });
});
