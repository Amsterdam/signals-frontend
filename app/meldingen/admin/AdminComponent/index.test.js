import React from 'react';

import { mount, shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import { MemoryRouter, withRouter, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';

import AdminComponent from './index';
import OverviewPage from '../containers/OverviewPage';
import IncidentDetailPage from '../containers/IncidentDetailPage';

const WrappedAdminComponent = withRouter(connect()(AdminComponent));

describe('<AdminComponent />', () => {
  const mockStore = configureStore();
  const initialState = {};
  let store;
  let wrapper;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/incidents']}>
          {/* <WrappedAdminComponent /> */}
          {/* <AdminComponent /> */}
          <Route path="/admin/incidents" component={WrappedAdminComponent} />
        </MemoryRouter>
      </Provider>,
    );
    console.log(wrapper);
  });

  it('should render correctly', () => {
    // expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(OverviewPage)).toHaveLength(1);
  });
});
