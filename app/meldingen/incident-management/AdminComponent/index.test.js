import React from 'react';

import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import AdminComponent from './index';

describe('<AdminComponent />', () => {
  const match = { url: '' };

  const createComponent = (isAuthenticated = false) => {
    const component = shallow(
      <AdminComponent isAuthenticated={isAuthenticated} match={match} />
    );

    // console.log('rendered component: ', component.debug());
    return component;
  };

  beforeEach(() => {
  });

  it('should render one route when not authenticated', () => {
    const component = createComponent();
    expect(component.find(Route)).toHaveLength(1);
  });

  it('should render two routes when authenticated', () => {
    const component = createComponent(true);
    expect(component.find(Route)).toHaveLength(2);
  });
});
