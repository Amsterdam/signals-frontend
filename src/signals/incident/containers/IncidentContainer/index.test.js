import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import { IncidentContainer, mapDispatchToProps } from './index';
import { GET_CLASSIFICATION, UPDATE_INCIDENT, CREATE_INCIDENT } from './constants';

jest.mock('signals/incident/components/form/MapInput', () => () => 'MapInput');

describe('<IncidentContainer />', () => {
  let props;
  let origSessionStorage;

  beforeEach(() => {
    props = {
      incidentContainer: { incident: {} },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
    };
    origSessionStorage = global.localStorage;

    global.localStorage = {
      getItem: key => {
        switch (key) {
          case 'accessToken':
            return '42';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    origSessionStorage = global.localStorage;

    global.localStorage = {
      getItem: key => {
        switch (key) {
          case 'accessToken':
            return '42';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.localStorage = origSessionStorage;
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { getAllByText } = render(withAppContext(<IncidentContainer {...props} />));

      expect(getAllByText('Volgende')).not.toBeNull(); // navigation
      expect(document.querySelectorAll('input[type="file"]')).toHaveLength(1); // image upload
      expect(document.querySelectorAll('input[type="radio"].kenmerkradio')).toHaveLength(2); // time indicator radio buttons
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
