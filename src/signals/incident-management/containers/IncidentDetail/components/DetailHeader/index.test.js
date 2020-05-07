import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';
import { MAP_URL } from 'signals/incident-management/routes';

import DetailHeader from './index';

jest.mock('./components/DownloadButton', () => () => <div data-testid="detail-header-button-download" />);

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    referrer: undefined,
  }),
}));

describe('<DetailHeader />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: {
        id: 42,
        status: {
          state: 'm',
        },
        _links: {
          'sia:pdf': { href: 'https://api.data.amsterdam.nl/signals/v1/private/signals/3076/pdf' },
        },
      },
      baseUrl: '/manage',
      onPatchIncident: jest.fn(),
    };
  });

  it('should render all buttons when state is gemeld and no parent or children are present', () => {
    const { queryByTestId, queryAllByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('backlink')).toHaveTextContent(/^Terug naar overzicht$/);
    expect(queryByTestId('detail-header-title')).toHaveTextContent(/^Melding 42$/);
    expect(queryByTestId('detail-header-button-split')).toHaveTextContent(/^Splitsen$/);
    expect(queryByTestId('detail-header-button-thor')).toHaveTextContent(/^THOR$/);
    expect(queryAllByTestId('detail-header-button-download')).toHaveLength(1);
  });

  it('should render no split button when children are present', () => {
    props.incident._links['sia:children'] = [{ mock: 'child' }];
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no split button when parent is present', () => {
    props.incident._links['sia:parent'] = { mock: 'parent' };
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no split button when state is not m', () => {
    props.incident.status.state = 'o';
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no thor button when state is not m, i, b, h, send failed or reopened', () => {
    props.incident.status.state = 'o';
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('detail-header-button-thor')).toBeNull();
  });

  it('test clicking the thor button', () => {
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    fireEvent.click(queryByTestId('detail-header-button-thor'));
    expect(props.onPatchIncident).toHaveBeenCalledWith({
      id: 42,
      type: 'thor',
      patch: {
        status: {
          state: 'ready to send',
          text: 'Te verzenden naar THOR',
          target_api: 'sigmax',
        },
      },
    });
  });

  it('should render a link with the correct referrer', () => {
    const { getByTestId, rerender } = render(withAppContext(<DetailHeader {...props} />));
    const incidentsUrl = `${props.baseUrl}/incidents`;

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(incidentsUrl));

    const referrer = '/some-url';
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }));

    rerender(withAppContext(<DetailHeader {...props} />));

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(incidentsUrl));

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer: MAP_URL,
    }));

    rerender(withAppContext(<DetailHeader {...props} />));

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(MAP_URL));
  });
});
