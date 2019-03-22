import React from 'react';
import { shallow } from 'enzyme';

import { IncidentHistoryContainer, mapDispatchToProps } from './index';
import { REQUEST_HISTORY_LIST } from './constants';

describe('<IncidentHistoryContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentHistoryContainer: {
        incident: {},
        incidentHistoryList: [{
          state: 'm'
        }]
      },
      onRequestHistoryList: jest.fn(),
      onRequestNoteCreate: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentHistoryContainer {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();


    it('should request the status list', () => {
      mapDispatchToProps(dispatch).onRequestHistoryList({});
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_HISTORY_LIST, payload: {} });
    });
  });
});
