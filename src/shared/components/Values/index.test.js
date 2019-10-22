import React from 'react';
import { mount, shallow } from 'enzyme';

import Values from '.';

describe('<Values />', () => {
  it('should render an <div> tag', () => {
    const wrapper = mount(<Values />);
    expect(wrapper.find('div').length).toEqual(1);
  });

  it('should render the json ', () => {
    const value = { id: 1, name: 'name' };
    const wrapper = shallow(<Values value={value} />);
    expect(wrapper).toMatchSnapshot();
  });
});
