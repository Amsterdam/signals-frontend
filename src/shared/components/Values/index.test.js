import React from 'react';
import { mount } from 'enzyme';

import Values from './';

describe('<Values />', () => {
  it('should render an <div> tag', () => {
    const renderedComponent = mount(<Values />);
    expect(renderedComponent.find('div').length).toEqual(1);
  });

  it('should render the json ', () => {
    const value = { id: 1, name: 'name' };
    const renderedComponent = mount(<Values value={value} />);
    expect(renderedComponent).toMatchSnapshot();
  });
});
