import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { memoryHistory } from 'react-router-dom';

import { IncidentManagementModule } from './index';
import configureStore from '../../../../configureStore';

jest.mock('../../containers/IncidentOverviewPage', () => () => 'IncidentOverviewPage');
jest.mock('../../containers/IncidentDetailPage', () => () => 'IncidentDetailPage');

describe('<IncidentManagementModule />', () => {
  let props;

  beforeEach(() => {
    props = {
      match: {
        isExact: false,
        params: {},
        path: '/manage',
        url: '/manage'
      },
      isAuthenticated: true,
    };
  });

  it('should render correctly when authenticated', () => {
    const wrapper = shallow(
      <IncidentManagementModule {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when not authenticated', () => {
    props.isAuthenticated = false;
    const wrapper = shallow(
      <IncidentManagementModule {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  describe('routing', () => {
    it('can navigate to incident list', () => {
      const store = configureStore({}, memoryHistory);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter keyLength={0} initialEntries={['/manage/incidents']}>
            <IncidentManagementModule {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('can navigate to incident detail', () => {
      const store = configureStore({}, memoryHistory);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter keyLength={0} initialEntries={['/manage/incident/666']}>
            <IncidentManagementModule {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
