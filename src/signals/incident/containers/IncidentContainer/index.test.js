import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';

import { mockStore } from '../../../../../internals/testing/test-utils';
import IncidentContainer from './index';

jest.mock('../../components/IncidentWizard', () => () => 'IncidentWizard');

describe('<IncidentContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidentContainer: { incident: {} },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      isAuthenticated: false
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const state = fromJS({
        global: {},
        incidentContainer: {
          incident: {}
        }
      });
      const store = mockStore(state);

      const wrapper = mount(<Provider store={store}><IncidentContainer {...props} /></Provider>);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
