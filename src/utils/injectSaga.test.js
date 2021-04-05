// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/**
 * Test injectors
 */
import { put } from 'redux-saga/effects'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { render } from '@testing-library/react'
import React from 'react'
import { withAppContext } from 'test/utils'

import injectSaga, { useInjectSaga } from './injectSaga'
import * as sagaInjectors from './sagaInjectors'

// Fixtures
const Component = () => null

function* testSaga() {
  yield put({ type: 'TEST', payload: 'yup' })
}

describe('injectSaga decorator', () => {
  let injectors
  let ComponentWithSaga

  beforeAll(() => {
    sagaInjectors.getInjectors = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    injectors = {
      injectSaga: jest.fn(),
      ejectSaga: jest.fn(),
    }
    ComponentWithSaga = injectSaga({
      key: 'test',
      saga: testSaga,
      mode: 'testMode',
    })(Component);
    sagaInjectors.getInjectors.mockClear();
  });

  it('should inject given saga, mode, and props', () => {
    const props = { test: 'test' }
    renderer.create(withAppContext(<ComponentWithSaga {...props} />))

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1)
    expect(injectors.injectSaga).toHaveBeenCalledWith(
      'test',
      { saga: testSaga, mode: 'testMode' },
      props
    )
  })

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' }
    const renderedComponent = renderer.create(
      withAppContext(<ComponentWithSaga {...props} />)
    )
    renderedComponent.unmount()

    expect(injectors.ejectSaga).toHaveBeenCalledTimes(1)
    expect(injectors.ejectSaga).toHaveBeenCalledWith('test')
  })

  it('should set a correct display name', () => {
    expect(ComponentWithSaga.displayName).toBe('withSaga(Component)')
    expect(
      injectSaga({ key: 'test', saga: testSaga })(() => null).displayName
    ).toBe('withSaga(Component)')
  })

  it('should propagate props', () => {
    const props = { testProp: 'test' }
    const renderedComponent = mount(
      withAppContext(<ComponentWithSaga {...props} />)
    )

    const { props: componentProps } = renderedComponent
      .find(ComponentWithSaga)
      .instance()

    expect(componentProps).toEqual(props)
  })
})

describe('useInjectSaga hook', () => {
  let injectors
  let ComponentWithSaga

  beforeAll(() => {
    sagaInjectors.getInjectors = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    injectors = {
      injectSaga: jest.fn(),
      ejectSaga: jest.fn(),
    }
    ComponentWithSaga = () => {
      useInjectSaga({
        key: 'test',
        saga: testSaga,
        mode: 'testMode',
      })
      return null
    }

    sagaInjectors.getInjectors.mockClear();
  });

  it('should inject given saga and mode', () => {
    const props = { test: 'test' }
    render(withAppContext(<ComponentWithSaga {...props} />))

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1)
    expect(injectors.injectSaga).toHaveBeenCalledWith('test', {
      saga: testSaga,
      mode: 'testMode',
    })
  })

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' }
    const { unmount } = render(withAppContext(<ComponentWithSaga {...props} />))
    unmount()

    expect(injectors.ejectSaga).toHaveBeenCalledTimes(1)
    expect(injectors.ejectSaga).toHaveBeenCalledWith('test')
  })
})
