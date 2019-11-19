import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';

import UserDetail from '..';

describe('signals/settings/users/containers/Detail', () => {
  it('should render a backlink', async () => {
    const referrer = '/some-page-we-came-from';
    let container;
    let rerender;

    await act(async () => {
      ({ container, rerender } = await render(withAppContext(<UserDetail location={{}} />)));
    });

    expect(container.querySelector('a').getAttribute('href')).toEqual(routes.users);

    await act(async () => {
      rerender(withAppContext(<UserDetail location={{ referrer }} />));
    });

    expect(container.querySelector('a').getAttribute('href')).toEqual(referrer);
  });

  it('should show an alert on error', async () => {
    let getByText;
    const error = new Error('Not allowed');
    fetch.mockRejectOnce(error);

    await act(async () => {
      ({ getByText } = await render(withAppContext(<UserDetail location={{}} />)));
    });

    expect(getByText('Gegevens konden niet opgehaald worden')).toBeInTheDocument();
  });
});
