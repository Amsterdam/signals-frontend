import React from 'react';
import { shallow } from 'enzyme';

import { IncidentStatusContainer, mapDispatchToProps } from './index';
import { REQUEST_STATUS_LIST, REQUEST_STATUS_CREATE } from './constants';

describe('<IncidentStatusContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentstatuscontainer: { incident: {} },
      onRequestStatusList: jest.fn(),
      onRequestStatusCreate: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentStatusContainer {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();


    it('should request the status list', () => {
      mapDispatchToProps(dispatch).onRequestStatusList({});
      expect(dispatch.mock.calls[0][0]).toEqual({ type: REQUEST_STATUS_LIST, payload: {} });
    });

    it('should request the status create', () => {
      mapDispatchToProps(dispatch).onRequestStatusCreate({ status: {} });
      expect(dispatch.mock.calls[0][0]).toEqual({ type: REQUEST_STATUS_CREATE, payload: { status: {} } });
    });
  });
});
