/**
 * Test injectors
 */

import { memoryHistory } from 'react-router-dom';
import { put } from 'redux-saga/effects';
import { shallow } from 'enzyme';
import React from 'react';

import configureStore from '../configureStore';
import injectSaga from './injectSaga';
import * as sagaInjectors from './sagaInjectors';

// Fixtures
const Component = () => null;

function* testSaga() {
  yield put({ type: 'TEST', payload: 'yup' });
}

describe('injectSaga decorator', () => {
  let store;
  let injectors;
  let ComponentWithSaga;

  beforeAll(() => {
    sagaInjectors.default = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    store = configureStore({}, memoryHistory);
    injectors = {
      injectSaga: jest.fn(),
      ejectSaga: jest.fn(),
    };
    sagaInjectors.default.mockClear();
  });

  it('should inject given saga, mode, and props', () => {
    ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga, mode: 'testMode' })(Component);
    const props = { test: 'test' };
    shallow(<ComponentWithSaga {...props} />, { context: { store } });

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.injectSaga).toHaveBeenCalledWith('test', { saga: testSaga, mode: 'testMode' }, props);
  });

  it('should inject multiple saga, mode, and props', () => {
    ComponentWithSaga = injectSaga([{ key: 'test', saga: testSaga, mode: 'testMode' }, { key: 'test2', saga: testSaga, mode: 'testMode' }])(Component);
    const props = { test: 'test' };
    shallow(<ComponentWithSaga {...props} />, { context: { store } });

    expect(injectors.injectSaga).toHaveBeenCalledTimes(2);
    expect(injectors.injectSaga).toHaveBeenCalledWith('test', { saga: testSaga, mode: 'testMode' }, props);
    expect(injectors.injectSaga).toHaveBeenCalledWith('test2', { saga: testSaga, mode: 'testMode' }, props);
  });

  it('should eject on unmount with a correct saga key', () => {
    ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga, mode: 'testMode' })(Component);
    const props = { test: 'test' };
    const wrapper = shallow(<ComponentWithSaga {...props} />, { context: { store } });
    wrapper.unmount();

    expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
  });

  it('should set a correct display name', () => {
    ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga, mode: 'testMode' })(Component);
    expect(ComponentWithSaga.displayName).toBe('withSaga(Component)');
    expect(injectSaga({ key: 'test', saga: testSaga })(() => null).displayName).toBe('withSaga(Component)');
  });

  it('should propagate props', () => {
    ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga, mode: 'testMode' })(Component);
    const props = { testProp: 'test' };
    const wrapper = shallow(<ComponentWithSaga {...props} />, { context: { store } });

    expect(wrapper.prop('testProp')).toBe('test');
  });
});
