import React from 'react';
import { shallow } from 'enzyme';

import { IncidentManagementModule } from './index';

describe('<IncidentManagementModule />', () => {
  let props;

  beforeEach(() => {
    props = {
      match: { params: { id: 1 }, url: 'http://test/url' },
      isAuthenticated: true
    };
  });

  it('should render correctly when authenticated', () => {
    const renderedComponent = shallow(
      <IncidentManagementModule {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render correctly when not authenticated', () => {
    props.isAuthenticated = false;
    const renderedComponent = shallow(
      <IncidentManagementModule {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });
});
