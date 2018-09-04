import React from 'react';
import { render } from 'enzyme';

import LoadingIndicator from './index';

describe('<LoadingIndicator />', () => {
  it('should render 13 divs', () => {
    const wrapper = render(
      <LoadingIndicator />
    );
    expect(wrapper.find('div').length).toBe(2);
  });
});
