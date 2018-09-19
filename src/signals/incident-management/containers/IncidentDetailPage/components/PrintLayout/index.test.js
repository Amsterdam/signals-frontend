import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { fromJS } from 'immutable';

import ConnectedPrintLayout, { PrintLayout } from './index';

jest.mock('../IncidentDetail', () => 'IncidentDetail');
jest.mock('../../../IncidentStatusContainer/components/List', () => 'List');

describe('<PrintLayout />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incident: {},
      stadsdeelList: [],
      onPrintView: jest.fn(),
      incidentstatuscontainer: { incidentStatusList: [], statusList: [], priorityList: [] }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <PrintLayout {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the connected component correctly', () => {
    const mockStore = configureMockStore({});
    const store = mockStore(fromJS({ incidentStatusContainer: { incidentStatusList: [], statusList: [], priorityList: [] } }));
    const wrapper = shallow(<ConnectedPrintLayout store={store} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
