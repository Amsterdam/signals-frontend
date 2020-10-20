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
  let injecModelSpy;

  beforeEach(() => {
    injecModelSpy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should inject reducer', () => {
    const mockedInjectReducerModel = (injectReducerModel as unknown) as jest.Mock<typeof injectReducerModel>; // compiler doesn't know that it's mocked. So manually cast it.

    mockedInjectReducerModel.mockImplementation(injecModelSpy);
    loadModel(store);

    expect(injecModelSpy).toHaveBeenCalledWith('global', reducer, store);
  });

  it('should inject saga', () => {
    const mockedInjectSagaModel = (injectSagaModel as unknown) as jest.Mock<typeof injectSagaModel>; // compiler doesn't know that it's mocked. So manually cast it.
    mockedInjectSagaModel.mockImplementation(injecModelSpy);
    loadModel(store);

    expect(injecModelSpy).toHaveBeenCalledWith('global', saga, store);
  });
});
