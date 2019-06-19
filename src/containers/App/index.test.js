import React from 'react';
import { shallow, mount } from 'enzyme';
import { Route, memoryHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
// import { memoryHistory } from 'react-router-dom';

import configureStore from 'configureStore';
import HeaderContainer from 'containers/HeaderContainer';
import Footer from 'components/Footer';
import { App, mapDispatchToProps } from './index';
import { REQUEST_CATEGORIES } from './constants';

describe('<App />', () => {
  let origSessionStorage;

  const props = {
    requestCategories: jest.fn()
  };

  beforeEach(() => {
    origSessionStorage = global.sessionStorage;
    global.sessionStorage = {
      getItem: (key) => {
        switch (key) {
          case 'accessToken':
            return '42';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
  });

  afterEach(() => {
    global.sessionStorage = origSessionStorage;
  });

  it('should render the header', () => {
    const wrapper = shallow(
      <App {...props} />
    );
    expect(wrapper.find(HeaderContainer).length).toBe(1);
  });

  it('should render some routes', () => {
    const wrapper = shallow(
      <App {...props} />
    );
    expect(wrapper.find(Route).length).not.toBe(0);
  });

  it('should render the footer', () => {
    const wrapper = shallow(
      <App {...props} />
    );
    expect(wrapper.find(Footer).length).toBe(1);
  });

  describe('routing', () => {
    it('can navigate to kto form', () => {
      const store = configureStore({}, memoryHistory);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter keyLength={0} initialEntries={['/kto/ja/12345-abcsde']}>
            <App {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      // For the `mapDispatchToProps`, call it directly but pass in
      // a mock function and check the arguments passed in are as expected
      mapDispatchToProps(dispatch).requestCategories();
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_CATEGORIES });
    });
  });
});
