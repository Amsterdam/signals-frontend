import React from 'react';
import { shallow } from 'enzyme';

import Tabs from './index';

describe('<Tabs />', () => {
  let props;

  beforeEach(() => {
    props = {
      selectedTab: 'tab1',
      tabs: {
        tab1: { name: 'tab1' },
        tab2: undefined,
        tab3: { name: 'tab3', count: 2 }
      },
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
    expect(props.onTabChanged).toHaveBeenCalledWith('tab1');
  });
});
