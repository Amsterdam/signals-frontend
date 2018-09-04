import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import HomePage from '../index';
import messages from '../messages';

describe('<HomePage />', () => {
  it('should render the page message', () => {
    const wrapper = shallow(
      <HomePage />
    );
    expect(wrapper.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
