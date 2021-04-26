/**
 * Test injectors
 */

 import { put } from 'redux-saga/effects';
 import { render } from '@testing-library/react';
 import React from 'react';
 import { Provider } from 'react-redux';

 import { createMemoryHistory } from 'history';
 import configureStore from '../../configureStore';
 import injectSaga, { useInjectSaga } from '../injectSaga';
 import { getInjectors } from '../sagaInjectors';

 const memoryHistory = createMemoryHistory();

 // Fixtures
 const Component = () => null;

 function* testSaga() {
   yield put({ type: 'TEST', payload: 'yup' });
 }

 jest.mock('../sagaInjectors');
 describe('injectSaga decorator', () => {
   let injectors: /* typeof getInjectors */ any;
   let ComponentWithSaga: any;

   beforeAll(() => {
     const mockedGetInjectors = (getInjectors as unknown) as jest.Mock<
       typeof getInjectors
     >; // compiler doesn't know that it's mocked. So manually cast it.
     mockedGetInjectors.mockImplementation(() => injectors);
   });

   beforeEach(() => {
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     injectors = {
       injectSaga: jest.fn(),
       ejectSaga: jest.fn(),
     };
     ComponentWithSaga = injectSaga({
       key: 'test',
       saga: testSaga,
       mode: 'testMode',
     })(Component);
   });

   it('should set a correct display name', () => {
     expect(ComponentWithSaga.displayName).toBe('withSaga(Component)');
     expect(
       injectSaga({ key: 'test', saga: testSaga })(() => null).displayName,
     ).toBe('withSaga(Component)');
   });
 });

 describe('useInjectSaga hook', () => {
   let store: any;
   let injectors: any;
   let ComponentWithSaga: any;

   beforeAll(() => {
     const mockedGetInjectors = (getInjectors as unknown) as jest.Mock<
       typeof getInjectors
     >; // compiler doesn't know that it's mocked. So manually cast it.
     mockedGetInjectors.mockImplementation(() => injectors);
   });

   beforeEach(() => {
     store = configureStore({}, memoryHistory);
     injectors = {
       injectSaga: jest.fn(),
       ejectSaga: jest.fn(),
     };
     ComponentWithSaga = () => {
       useInjectSaga({
         key: 'test',
         saga: testSaga,
         mode: 'testMode',
       });
       return null;
     };
   });

   it('should inject given saga and mode', () => {
     const props = { test: 'test' };
     render(
       // tslint:disable-next-line: jsx-wrap-multiline
       <Provider store={store}>
         <ComponentWithSaga {...props} />
       </Provider>,
     );

     expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
     expect(injectors.injectSaga).toHaveBeenCalledWith('test', {
       saga: testSaga,
       mode: 'testMode',
     });
   });

   it('should eject on unmount with a correct saga key', () => {
     const props = { test: 'test' };
     const { unmount } = render(
       // tslint:disable-next-line: jsx-wrap-multiline
       <Provider store={store}>
         <ComponentWithSaga {...props} />
       </Provider>,
     );
     unmount();

     expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
     expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
   });
 });
