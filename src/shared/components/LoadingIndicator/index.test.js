import React from 'react';
import { render } from 'enzyme';

import LoadingIndicator from '.';

describe('<LoadingIndicator />', () => {
  it('should render 13 divs', () => {
    const wrapper = render(
      <LoadingIndicator />
    );
    expect(wrapper.find('div').length).toBe(2);
  });
});
