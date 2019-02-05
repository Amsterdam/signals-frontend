import React from 'react';
import { shallow } from 'enzyme';

import { IncidentSplitContainer, mapDispatchToProps } from './index';
import { REQUEST_INCIDENT } from './constants';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

describe('<IncidentDetailPage />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '42',
      incidentSplitContainer: {
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
        <IncidentSplitContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
      expect(props.onRequestIncident).toHaveBeenCalledWith('42');
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onRequestIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENT, payload: 42 });
    });
  });
});
