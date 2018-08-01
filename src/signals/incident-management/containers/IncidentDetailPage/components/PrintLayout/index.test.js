import React from 'react';
import { shallow } from 'enzyme';

import PrintLayout from './index';

describe('<PrintLayout />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incident: {},
      stadsdeelList: [],
      onPrintView: jest.fn()
    };
  });

  it('should render correctly', () => {
    const renderedComponent = shallow(
      <PrintLayout {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });
});
