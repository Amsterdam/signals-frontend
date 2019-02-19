import React from 'react';
import { shallow } from 'enzyme';

import { REQUEST_INCIDENT } from 'models/incident/constants';
import { REQUEST_NOTES_LIST } from 'models/notes/constants';
import { IncidentDetailPage, mapDispatchToProps } from './index';

import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';
import ConnectedPrintLayout from './components/PrintLayout';

jest.mock('./components/MapDetail', () => () => 'MapDetail');
jest.mock('./components/IncidentDetail', () => () => 'IncidentDetail');
jest.mock('../IncidentCategoryContainer', () => () => 'IncidentCategoryContainer');
jest.mock('../IncidentPriorityContainer', () => () => 'IncidentPriorityContainer');
jest.mock('../IncidentNotesContainer', () => () => 'IncidentNotesContainer');
jest.mock('../IncidentStatusContainer', () => () => 'IncidentStatusContainer');
jest.mock('./components/PrintLayout', () => () => 'PrintLayout');
jest.mock('shared/components/LoadingIndicator', () => () => 'LoadingIndicator');

describe('<IncidentDetailPage />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incidentdetailpage: {
        incidentNotesList: []
      },
      incidentModel: {
        incident: {},
        stadsdeelList,
        priorityList,
        loading: false
      },
      onRequestIncident: jest.fn(),
      onRequestNotesList: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
      expect(props.onRequestIncident).toHaveBeenCalledWith('100');
      expect(props.onRequestNotesList).toHaveBeenCalledWith('100');
    });

    it('should render correctly with location', () => {
      props.incidentModel.incident.location = {};
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly with image', () => {
      props.incidentModel.incident.image = 'some-image';
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly without incident', () => {
      props.incidentModel.incident = undefined;
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should change the state', () => {
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      wrapper.instance().onPrintView();
      wrapper.instance().onTabChanged(1);
      expect(wrapper.instance().state).toEqual({ selectedTab: 1, printView: true });
    });

    it('should render the print view', () => {
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      wrapper.instance().onPrintView();
      wrapper.update();
      expect(wrapper.find(ConnectedPrintLayout).length).toEqual(1);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onRequestIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENT, payload: 42 });
    });

    it('should request the notes list', () => {
      mapDispatchToProps(dispatch).onRequestNotesList(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_NOTES_LIST, payload: 42 });
    });
  });
});
