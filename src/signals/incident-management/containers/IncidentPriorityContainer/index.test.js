import React from 'react';
import { shallow } from 'enzyme';

import { IncidentPriorityContainer, mapDispatchToProps } from './index';
import { REQUEST_PRIORITY_UPDATE } from './constants';

jest.mock('./components/Add', () => () => 'Add');

describe('<IncidentPriorityContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentPriorityContainer: { subpriorityList: [] },
      onRequestPriorityUpdate: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentPriorityContainer {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request the priority update', () => {
      mapDispatchToProps(dispatch).onRequestPriorityUpdate({});
      expect(dispatch.mock.calls[0][0]).toEqual({ type: REQUEST_PRIORITY_UPDATE, payload: {} });
    });
  });
});
