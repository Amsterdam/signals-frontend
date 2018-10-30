import React from 'react';
import { shallow } from 'enzyme';

import { IncidentDetailPage, mapDispatchToProps } from './index';
import { REQUEST_INCIDENT } from './constants';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';
import ConnectedPrintLayout from './components/PrintLayout';

describe('<IncidentDetailPage />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incidentdetailpage: {
        incident: {},
        stadsdeelList,
        priorityList
      },
      onRequestIncident: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly with location', () => {
      props.incidentdetailpage.incident.location = {};
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly with image', () => {
      props.incidentdetailpage.incident.image = 'some-image';
      const wrapper = shallow(
        <IncidentDetailPage {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly without incident', () => {
      props.incidentdetailpage.incident = undefined;
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
      // For the `mapDispatchToProps`, call it directly but pass in
      // a mock function and check the arguments passed in are as expected
      mapDispatchToProps(dispatch).onRequestIncident({});
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENT, payload: {} });
    });
  });
});
