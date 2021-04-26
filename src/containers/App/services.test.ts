import type { InjectedStore } from 'types';
import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';

import reducer from './reducer'
import saga from './saga'

import loadModel from './services'

jest.mock('utils/injectReducerModel')
jest.mock('utils/injectSagaModel')

jest.mock('./reducer')
jest.mock('./saga')

describe('containers/App/services', () => {
  const store = {
    getState: jest.fn(),
    dispatch: jest.fn(),
    injectedReducers: {},
    injectedSagas: {},
    runSaga: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  } as unknown as InjectedStore;
  let injectModelSpy: jest.Mock;

  beforeEach(() => {
    injectModelSpy = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should inject reducer', () => {
    const mockedInjectReducerModel = (injectReducerModel as unknown) as jest.Mock<
      typeof injectReducerModel
    >
    mockedInjectReducerModel.mockImplementation(injectModelSpy)
    loadModel(store)

    expect(injectModelSpy).toHaveBeenCalledWith('global', reducer, store)
  })

  it('should inject saga', () => {
    const mockedInjectSagaModel = (injectSagaModel as unknown) as jest.Mock<
      typeof injectSagaModel
    >
    mockedInjectSagaModel.mockImplementation(injectModelSpy)
    loadModel(store)

    expect(injectModelSpy).toHaveBeenCalledWith('global', saga, store)
  })
})
