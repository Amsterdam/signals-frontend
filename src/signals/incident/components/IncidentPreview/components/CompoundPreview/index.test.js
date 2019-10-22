import React from 'react';
import { shallow } from 'enzyme/build';
import { createCompoundPreview } from './index';

describe('the compound preview component', () => {
  it('should wrap two different components in a div', () => {
    const Compound = createCompoundPreview([
      () => <span>hello world</span>,
      foo => (
        <span>
bar:
          {foo}
        </span>
      ),
    ]);

    const wrapper = shallow(<Compound abc="xyz" />);

    expect(wrapper).toMatchSnapshot();
  });
});
