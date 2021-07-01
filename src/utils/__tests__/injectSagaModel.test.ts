import { InjectedStore } from 'types'
import { Action, Dispatch } from 'redux'
import { getInjectors } from 'utils/sagaInjectors'

import injectSagaModel from '../injectSagaModel'

jest.mock('utils/sagaInjectors')

const action: Action<number> = {
  type: 10,
}

const dispatch: Dispatch<typeof action> = (param) => param

describe('injectSagaModel', () => {
  const mockSaga = jest.fn()
  let store: Pick<
    InjectedStore,
    | 'dispatch'
    | 'getState'
    | 'injectedReducers'
    | 'injectedSagas'
    | 'replaceReducer'
    | 'runSaga'
    | 'subscribe'
  >
  let injectors: any

  beforeAll(() => {
    injectors = {
      injectReducer: jest.fn(),
      injectSaga: jest.fn(),
    }
    const mockedGetInjectors = getInjectors as unknown as jest.Mock<
      typeof getInjectors
    > // compiler doesn't know that it's mocked. So manually cast it.
    mockedGetInjectors.mockImplementation(() => injectors)
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

  it('should inject model into saga', () => {
    injectSagaModel('mockKey', mockSaga, store as InjectedStore)

    expect(getInjectors).toHaveBeenCalledWith(store)
    expect(injectors.injectSaga).toHaveBeenCalledWith('mockKey', {
      saga: mockSaga,
    })

    jest.resetAllMocks()
  })
})
