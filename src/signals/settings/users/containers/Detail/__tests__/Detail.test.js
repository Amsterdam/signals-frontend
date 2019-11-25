import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';

import UserDetail from '..';

describe('signals/settings/users/containers/Detail', () => {
  it('should render a backlink', () => {
    const referrer = '/some-page-we-came-from';
    const { container, rerender } =  render(withAppContext(<UserDetail location={{}} />));

    expect(container.querySelector('a').getAttribute('href')).toEqual(routes.users);

    rerender(withAppContext(<UserDetail location={{ referrer }} />));

    expect(container.querySelector('a').getAttribute('href')).toEqual(referrer);
  });
});
