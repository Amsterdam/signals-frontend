import { InjectedStore } from 'types'
import { Action, Dispatch } from 'redux'
import { getInjectors } from 'utils/reducerInjectors'

import injectReducerModel from '../injectReducerModel'

jest.mock('utils/reducerInjectors')
const action: Action<number> = {
  type: 10,
}

const dispatch: Dispatch<typeof action> = (param) => param

describe('injectReducerModel', () => {
  const mockReducer = jest.fn()
  let store: Omit<InjectedStore, '[Symbol.observable]'>
  let injectors: any

  beforeAll(() => {
    injectors = {
      injectReducer: jest.fn(),
    }
    const mockedGetInjectors = getInjectors as unknown as jest.Mock<
      typeof getInjectors
    > // compiler doesn't know that it's mocked. So manually cast it.
    mockedGetInjectors.mockImplementation(() => injectors)
    // eslint-disable-next-line global-require
    // injectReducer = require('../injectReducer').default
  })

  beforeEach(() => {
    store = {
      dispatch,
      subscribe: () => () => {},
      getState: () => {},
      replaceReducer: () => {},
      runSaga: () => {},
      injectedReducers: {},
      injectedSagas: {},
    }
  })

  it('should inject model into reducer', () => {
    injectReducerModel('mockKey', mockReducer, store as InjectedStore)

    expect(getInjectors).toHaveBeenCalledWith(store)
    expect(injectors.injectReducer).toHaveBeenCalledWith('mockKey', mockReducer)

    jest.resetAllMocks()
  })
})
