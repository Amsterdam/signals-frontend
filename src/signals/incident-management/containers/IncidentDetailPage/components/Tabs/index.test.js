import React from 'react';
import { shallow } from 'enzyme';

import Tabs from './index';

describe('<Tabs />', () => {
  let props;

  beforeEach(() => {
    props = {
      selectedTab: 0,
      tabs: ['tab1', 'tab2'],
      onTabChanged: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <Tabs {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onTabChanged when the tab is clicked', () => {
    const wrapper = shallow(
      <Tabs {...props} />
    );

    wrapper.find('li').first().simulate('click');
    expect(props.onTabChanged).toHaveBeenCalledWith(0);
  });
});
