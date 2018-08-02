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
    const renderedComponent = shallow(
      <PrintLayout {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render the connected component correctly', () => {
    const mockStore = configureMockStore({});
    const store = mockStore(fromJS({ incidentStatusContainer: { incidentStatusList: [], statusList: [] } }));
    const renderedComponent = shallow(<ConnectedPrintLayout store={store} {...props} />);
    expect(renderedComponent).toMatchSnapshot();
  });
});

