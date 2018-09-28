import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import { IncidentOverviewPage, mapDispatchToProps } from './index';
import { REQUEST_INCIDENTS, INCIDENT_SELECTED, MAIN_CATEGORY_FILTER_SELECTION_CHANGED } from './constants';

import { getContext } from '../../../../../internals/testing/test-utils';

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
        page: 3
      },
      onRequestIncidents: jest.fn(),
      onIncidentSelected: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn(),
      baseUrl: ''
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const state = fromJS({
        global: {},
        incidentOverviewPage: {
          incidents: []
        }
      });
      const context = getContext(state);
      const wrapper = shallow(<IncidentOverviewPage {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render loader correctly', () => {
      const state = fromJS({
        global: {},
        incidentOverviewPage: {
          incidents: []
        }
      });

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

    it('should change the filter', () => {
      mapDispatchToProps(dispatch).onMainCategoryFilterSelectionChanged({ category__sub: ['Graffiti / wildplak'] });
      expect(dispatch).toHaveBeenCalledWith({ type: MAIN_CATEGORY_FILTER_SELECTION_CHANGED, payload: { category__sub: ['Graffiti / wildplak'] } });
    });
  });
});
