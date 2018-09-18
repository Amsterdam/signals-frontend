import React from 'react';
import { shallow } from 'enzyme';

import { IncidentDetailPage, mapDispatchToProps } from './index';
import { REQUEST_INCIDENT } from './constants';
import stadsdeelList from '../../definitions/stadsdeelList';
import ConnectedPrintLayout from './components/PrintLayout';

describe('<IncidentDetailPage />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incidentdetailpage: { incident: {}, stadsdeelList },
      onRequestIncident: jest.fn(),

    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentDetailPage {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

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

  it('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    // For the `mapDispatchToProps`, call it directly but pass in
    // a mock function and check the arguments passed in are as expected
    mapDispatchToProps(dispatch).onRequestIncident({});
    expect(dispatch.mock.calls[0][0]).toEqual({ type: REQUEST_INCIDENT, payload: {} });
  });
});
