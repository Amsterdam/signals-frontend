/**
 * Test injectors
 */

import { Provider } from 'react-redux'
import { render } from '@testing-library/react'

import { createMemoryHistory } from 'history'
import configureStore from '../../configureStore'
import { getInjectors } from '../reducerInjectors'

import { useInjectReducer } from '../injectReducer'

const memoryHistory = createMemoryHistory()
jest.mock('../reducerInjectors')

// Fixtures
const Component = () => null

const reducer = (s: any) => s

describe('injectReducer decorator', () => {
  let ComponentWithReducer: any
  let injectReducer: any
  let injectors: any

  beforeAll(() => {
    const mockedGetInjectors = getInjectors as unknown as jest.Mock<
      typeof getInjectors
    > // compiler doesn't know that it's mocked. So manually cast it.
    mockedGetInjectors.mockImplementation(() => injectors)
    // eslint-disable-next-line global-require
    injectReducer = require('../injectReducer').default
  })

  beforeEach(() => {
    injectors = {
      injectReducer: jest.fn(),
    }
    ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component)
    jest.unmock('../reducerInjectors')
  })

  it('should set a correct display name', () => {
    expect(ComponentWithReducer.displayName).toBe('withReducer(Component)')
    expect(
      injectReducer({ key: 'test', reducer })(() => null).displayName
    ).toBe('withReducer(Component)')
  })
})

describe('useInjectReducer hook', () => {
  let store: any
  let injectors: any
  let ComponentWithReducer: any

  beforeAll(() => {
    injectors = {
      injectReducer: jest.fn(),
    }
    const mockedGetInjectors = getInjectors as unknown as jest.Mock<
      typeof getInjectors
    > // compiler doesn't know that it's mocked. So manually cast it.
    mockedGetInjectors.mockImplementation(() => injectors)

    store = configureStore({}, memoryHistory)
    ComponentWithReducer = () => {
      useInjectReducer({ key: 'test', reducer })
      return null
    }
  })

  it('should inject a given reducer', () => {
    render(
      // tslint:disable-next-line: jsx-wrap-multiline
      <Provider store={store}>
        <ComponentWithReducer />
      </Provider>
    )

    expect(injectors.injectReducer).toHaveBeenCalledTimes(1)
    expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer)
  })
})
