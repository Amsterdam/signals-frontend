import React from 'react';
import { shallow } from 'enzyme';

import { getContext } from 'test/utils';
import { IncidentContainer, mapDispatchToProps } from './index';
import { GET_CLASSIFICATION, UPDATE_INCIDENT, CREATE_INCIDENT } from './constants';

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
      const state = {
        global: {},
        incidentContainer: {
          incident: {}
        }
      };
      const context = getContext(state);
      const wrapper = shallow(<IncidentContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should get classification', () => {
      mapDispatchToProps(dispatch).getClassification('snelle boot');
      expect(dispatch).toHaveBeenCalledWith({ type: GET_CLASSIFICATION, payload: 'snelle boot' });
    });

    it('should update the incident', () => {
      mapDispatchToProps(dispatch).updateIncident({ subcategory: 'foo' });
      expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_INCIDENT, payload: { subcategory: 'foo' } });
    });

    it('should create the incident', () => {
      mapDispatchToProps(dispatch).createIncident({ description: 'bar' });
      expect(dispatch).toHaveBeenCalledWith({ type: CREATE_INCIDENT, payload: { description: 'bar' } });
    });
  });
});
