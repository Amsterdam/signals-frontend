import React from 'react';
import { shallow } from 'enzyme';

import { IncidentDetailPage, mapDispatchToProps } from './index';
import { REQUEST_INCIDENT } from './constants';
import stadsdeelList from '../../definitions/stadsdeelList';
import PrintLayout from './components/PrintLayout';


describe('<IncidentDetailPage />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incidentdetailpage: { incident: {}, stadsdeelList },
      onRequestIncident: jest.fn()
    };
  });

  it('should render correctly', () => {
    const renderedComponent = shallow(
      <IncidentDetailPage {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should change the state', () => {
    const renderedComponent = shallow(
      <IncidentDetailPage {...props} />
    );
    renderedComponent.instance().onPrintView();
    renderedComponent.instance().onTabChanged(1);
    expect(renderedComponent.instance().state).toEqual({ selectedTab: 1, printView: true });
  });

  it('should render the print view', () => {
    const renderedComponent = shallow(
      <IncidentDetailPage {...props} />
    );
    renderedComponent.instance().onPrintView();
    renderedComponent.update();
    expect(renderedComponent.find(PrintLayout).length).toEqual(1);
    expect(renderedComponent).toMatchSnapshot();
  });

  it('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    // For the `mapDispatchToProps`, call it directly but pass in
    // a mock function and check the arguments passed in are as expected
    mapDispatchToProps(dispatch).onRequestIncident({});
    expect(dispatch.mock.calls[0][0]).toEqual({ type: REQUEST_INCIDENT, payload: {} });
  });
});
