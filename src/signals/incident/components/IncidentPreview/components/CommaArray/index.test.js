import React from 'react';
import { shallow } from 'enzyme/build';
import CommaArray from './index';

describe('the comma array preview component', () => {
  it('should comma separate values', () => {
    const wrapper = shallow(<CommaArray label="foo" value={['1', '2']} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle empty array', () => {
    const wrapper = shallow(<CommaArray label="foo" value={[]} />);
    expect(wrapper).toMatchSnapshot();
  });
});
