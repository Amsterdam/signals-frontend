import React from 'react';
import { shallow } from 'enzyme';

import { getContext } from 'test/utils';

import { IncidentOverviewPage, mapDispatchToProps } from './index';
import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';

jest.mock('./components/Filter', () => () => 'Filter');
jest.mock('./components/List', () => () => 'List');
jest.mock('./components/Pager', () => () => 'Pager');

describe('<IncidentContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      overviewpage: {
        incidents: [],
        loading: false,
        filter: {},
        incidentsCount: 666,
        page: 3,
      },
      categories: {},
      onRequestIncidents: jest.fn(),
      onIncidentSelected: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn(),
      baseUrl: '',
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const state = {
        global: {},
        incidentOverviewPage: {
          incidents: [],
        },
      };
      const context = getContext(state);
      const wrapper = shallow(<IncidentOverviewPage {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render loader correctly', () => {
      const state = {
        global: {},
        incidentOverviewPage: {
          incidents: [],
        },
      };

      props.overviewpage.loading = true;

      const context = getContext(state);
      const wrapper = shallow(<IncidentOverviewPage {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request incidents', () => {
      mapDispatchToProps(dispatch).onRequestIncidents({ filter: {}, page: 666 });
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENTS, payload: { filter: {}, page: 666 } });
    });

    it('should select an incident', () => {
      mapDispatchToProps(dispatch).onIncidentSelected({ id: 666 });
      expect(dispatch).toHaveBeenCalledWith({ type: INCIDENT_SELECTED, payload: { id: 666 } });
    });
  });
});
