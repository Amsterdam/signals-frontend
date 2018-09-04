import React from 'react';
// import { Provider } from 'react-redux';
// import { browserHistory } from 'react-router-dom';
import { shallow } from 'enzyme';

import { MainMenu } from './index';

describe('<MainMenu />', () => {
  const createComponent = (isAuthenticated = false) => {
    const wrapper = shallow(<MainMenu isAuthenticated={isAuthenticated} />);
    return wrapper;
  };

  beforeEach(() => {
  });

  it('should render correctly', () => {
    const wrapper = createComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render render 2 NavLink components when not authenticated', () => {
    const wrapper = createComponent();
    expect(wrapper.find('NavLink').length).toEqual(1);
  });

  it('should render render 3 NavLink components when authenticated', () => {
    const isAuthenticated = true;
    const wrapper = createComponent(isAuthenticated);
    expect(wrapper.find('NavLink').length).toEqual(2);
  });
});
