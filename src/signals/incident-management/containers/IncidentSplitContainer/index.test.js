import React from 'react';
import { shallow } from 'enzyme';

import { REQUEST_INCIDENT } from 'models/incident/constants';

import { IncidentSplitContainer, mapDispatchToProps } from './index';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

describe('<IncidentSplitContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '42',
      categories: {
        sub: []
      },
      incidentModel: {
        incident: {},
        stadsdeelList,
        priorityList,
        loading: false
      },
      onRequestIncident: jest.fn(),
      onSplitIncident: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <IncidentSplitContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
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
