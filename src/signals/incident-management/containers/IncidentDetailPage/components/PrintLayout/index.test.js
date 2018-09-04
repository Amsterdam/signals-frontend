import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { fromJS } from 'immutable';

import ConnectedPrintLayout, { PrintLayout } from './index';

describe('<PrintLayout />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incident: {},
      stadsdeelList: [],
      onPrintView: jest.fn(),
      incidentstatuscontainer: { incidentStatusList: [], statusList: [] }
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
    const store = mockStore(fromJS({ incidentStatusContainer: { incidentStatusList: [], statusList: [] } }));
    const wrapper = shallow(<ConnectedPrintLayout store={store} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

