import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { fromJS } from 'immutable';

import IncidentContainer from './index';
// import IncidentContainer from './index';

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
    // it('should render correctly', () => {
      // const wrapper = shallow(
        // <IncidentContainer {...props} />
      // );
      // expect(wrapper).toMatchSnapshot();
    // });

    it('should render correctly', () => {
      const mockStore = configureStore();
      const store = mockStore(fromJS({ incidentContainer: { incident: {} } }));
      const wrapper = mount(<Provider store={store}><IncidentContainer {...props} /></Provider>);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
