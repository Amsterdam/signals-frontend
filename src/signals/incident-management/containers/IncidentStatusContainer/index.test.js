import React from 'react';
import { shallow } from 'enzyme';

import { IncidentStatusContainer, mapDispatchToProps } from './index';
import { REQUEST_STATUS_LIST, REQUEST_STATUS_CREATE } from './constants';

describe('<IncidentStatusContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentStatusContainer: {
        incident: {},
        incidentStatusList: [{
          state: 'm'
        }]
      },
      onRequestStatusList: jest.fn(),
      onRequestStatusCreate: jest.fn(),
      onRequestStatusDismissError: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <IncidentStatusContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly when canDisplay is false', () => {
      props.incidentStatusContainer.incidentStatusList = [{
        state: 666
      }];
      const wrapper = shallow(
        <IncidentStatusContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request the status list', () => {
      mapDispatchToProps(dispatch).onRequestStatusList({});
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_STATUS_LIST, payload: {} });
    });

    it('should request the status create', () => {
      mapDispatchToProps(dispatch).onRequestStatusCreate({ status: {} });
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_STATUS_CREATE, payload: { status: {} } });
    });
  });
});
