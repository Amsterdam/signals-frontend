// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/**
 * Test injectors
 */
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import injectReducer, { useInjectReducer } from './injectReducer'
import * as reducerInjectors from './reducerInjectors'

// Fixtures
const Component = () => null

const reducer = (s) => s

describe('injectReducer decorator', () => {
  let injectors
  let ComponentWithReducer

  beforeAll(() => {
    reducerInjectors.default = jest.fn().mockImplementation(() => injectors)
  })

  beforeEach(() => {
    injectors = {
      injectReducer: jest.fn(),
    }
    ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component)
    reducerInjectors.default.mockClear()
  })

  it('should inject a given reducer', () => {
    renderer.create(withAppContext(<ComponentWithReducer />))

    expect(injectors.injectReducer).toHaveBeenCalledTimes(1)
    expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer)
  })

  it('should set a correct display name', () => {
    expect(ComponentWithReducer.displayName).toBe('withReducer(Component)')
    expect(
      injectReducer({ key: 'test', reducer })(() => null).displayName
    ).toBe('withReducer(Component)')
  })

  it('should propagate props', () => {
    const props = { testProp: 'test' }
    const renderedComponent = mount(
      withAppContext(<ComponentWithReducer {...props} />)
    )

    const { props: componentProps } = renderedComponent
      .find(ComponentWithReducer)
      .instance()

    expect(componentProps).toEqual(props)
  })
})

describe('useInjectReducer hook', () => {
  let injectors
  let ComponentWithReducer

  beforeAll(() => {
    injectors = {
      injectReducer: jest.fn(),
    }
    reducerInjectors.default = jest.fn().mockImplementation(() => injectors)
    ComponentWithReducer = () => {
      useInjectReducer({ key: 'test', reducer })
      return null
    }
  })

  it('should inject a given reducer', () => {
    render(withAppContext(<ComponentWithReducer />))

    expect(injectors.injectReducer).toHaveBeenCalledTimes(1)
    expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer)
  })
})
