import React from 'react';
import { shallow } from 'enzyme';

import { REQUEST_INCIDENT } from 'models/incident/constants';
import { SPLIT_INCIDENT } from './constants';

import { IncidentSplitContainer, mapDispatchToProps } from './index';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

describe('<IncidentSplitContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '42',
      categories: {
        sub: [],
      },
      incidentModel: {
        incident: {},
        attachments: [],
        stadsdeelList,
        priorityList,
        loading: false,
      },
      onRequestIncident: jest.fn(),
      onRequestAttachments: jest.fn(),
      onSplitIncident: jest.fn(),
      onGoBack: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <IncidentSplitContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render loading indicator correctly', () => {
      props.incidentModel.loading = true;
      const wrapper = shallow(
        <IncidentSplitContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should handle submit', () => {
      const mockForm = { foo: 'bar' };
      const wrapper = shallow(
        <IncidentSplitContainer {...props} />
      );

      wrapper.instance().handleSubmit(mockForm);
      expect(props.onSplitIncident).toHaveBeenCalledWith(mockForm);
    });

    it('should handle cancel', () => {
      const wrapper = shallow(
        <IncidentSplitContainer {...props} />
      );

      wrapper.instance().handleCancel();
      expect(props.onGoBack).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onRequestIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENT, payload: 42 });
    });

    it('onSplitIncident', () => {
      mapDispatchToProps(dispatch).onSplitIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: SPLIT_INCIDENT, payload: 42 });
    });

    it('onGoBack', () => {
      mapDispatchToProps(dispatch).onGoBack();
      expect(dispatch).toHaveBeenCalledWith({ type: '@@router/CALL_HISTORY_METHOD', payload: { args: [], method: 'goBack' } });
    });
  });
});
