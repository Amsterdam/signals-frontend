/**
 * Test injectors
 */

import { memoryHistory } from 'react-router-dom';
import { shallow } from 'enzyme';
import React from 'react';
import identity from 'lodash/identity';

import configureStore from '../configureStore';
import injectReducer from './injectReducer';
import * as reducerInjectors from './reducerInjectors';

// Fixtures
const Component = () => null;

const reducer = identity;

describe('injectReducer decorator', () => {
  let store;
  let injectors;
  let ComponentWithReducer;

  beforeAll(() => {
    reducerInjectors.default = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    store = configureStore({}, memoryHistory);
    injectors = {
      injectReducer: jest.fn(),
    };
    reducerInjectors.default.mockClear();
  });

  it('should inject a given reducer', () => {
    ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component);
    shallow(<ComponentWithReducer />, { context: { store } });

    expect(injectors.injectReducer).toHaveBeenCalledTimes(1);
    expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer);
  });

  it('should inject multiple reducer', () => {
    ComponentWithReducer = injectReducer([{ key: 'test', reducer }, { key: 'test2', reducer }])(Component);
    shallow(<ComponentWithReducer />, { context: { store } });

    expect(injectors.injectReducer).toHaveBeenCalledTimes(2);
    expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer);
    expect(injectors.injectReducer).toHaveBeenCalledWith('test2', reducer);
  });

  it('should set a correct display name', () => {
    ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component);
    expect(ComponentWithReducer.displayName).toBe('withReducer(Component)');
    expect(injectReducer({ key: 'test', reducer })(() => null).displayName).toBe('withReducer(Component)');
  });

  it('should propagate props', () => {
    ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component);
    const props = { testProp: 'test' };
    const wrapper = shallow(<ComponentWithReducer {...props} />, { context: { store } });

    expect(wrapper.prop('testProp')).toBe('test');
  });
});
