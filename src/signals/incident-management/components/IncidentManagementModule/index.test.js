import React from 'react';
import { shallow } from 'enzyme';

import { IncidentManagementModule } from './index';

describe('<IncidentManagementModule />', () => {
  let props;

  beforeEach(() => {
    props = {
      match: { params: { id: 1 }, url: 'http://test/url' },
      isAuthenticated: true,
      isPublicPage: false
    };
  });

  it('should render correctly when authenticated', () => {
    const renderedComponent = shallow(
      <IncidentManagementModule {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render correctly when not authenticated on public page', () => {
    props.isAuthenticated = false;
    props.isPublicPage = true;
    const renderedComponent = shallow(
      <IncidentManagementModule {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render correctly when not authenticated on management page', () => {
    props.isAuthenticated = false;
    props.isPublicPage = false;
    const renderedComponent = shallow(
      <IncidentManagementModule {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });
});
