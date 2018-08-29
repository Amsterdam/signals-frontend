/**
 * Testing the NotFoundPage
 */

import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import NotFound from './index';

describe('<NotFound />', () => {
  it('should render the Page Not Found text', () => {
    const wrapper = shallow(
      <NotFound />
    );
    expect(wrapper.contains(
      <h1>
        <FormattedMessage
          id="boilerplate.containers.NotFoundPage.header"
          defaultMessage={'Page not found.'}
        />
      </h1>)).toEqual(true);
  });
});
