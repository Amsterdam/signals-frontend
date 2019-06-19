import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import NotFoundPage from '../index';
import messages from '../messages';

describe('<NotFoundPage />', () => {
  it('should render the page message', () => {
    const wrapper = shallow(
      <NotFoundPage />
    );
    expect(wrapper.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
