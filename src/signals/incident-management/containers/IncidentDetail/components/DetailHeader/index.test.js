import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext } from 'test/utils';
import { MAP_URL, INCIDENTS_URL } from 'signals/incident-management/routes';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import { patchIncident } from 'models/incident/actions';
import { PATCH_TYPE_THOR } from 'models/incident/constants';

import DetailHeader from '.';

jest.mock('./components/DownloadButton', () => () => <div data-testid="detail-header-button-download" />);

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    referrer: undefined,
  }),
}));

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

describe('<DetailHeader />', () => {
  let props;

  beforeEach(() => {
    props = {
      status: 'm',
      incidentId: 1234,
      links: incidentFixture._links,
    };
  });

  it('should render parent link', () => {
    const { queryByTestId, rerender } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('parentLink')).not.toBeInTheDocument();

    rerender(
      withAppContext(
        <DetailHeader {...props} links={{ ...props.links, 'sia:parent': { href: '//href-to-parent/5678' } }} />
      )
    );

    expect(queryByTestId('parentLink')).toBeInTheDocument();
    expect(queryByTestId('parentLink').href).toEqual(expect.stringContaining('5678'));
  });

  it('should render all buttons when state is gemeld and no parent or children are present', () => {
    const { queryByTestId, queryAllByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('backlink')).toHaveTextContent(/^Terug naar overzicht$/);
    expect(queryByTestId('detail-header-title')).toHaveTextContent(`Melding ${props.incidentId}`);
    expect(queryByTestId('detail-header-button-thor')).toHaveTextContent(/^THOR$/);
    expect(queryAllByTestId('detail-header-button-download')).toHaveLength(1);
  });

  it('should render no split button when children are present', () => {
    const { queryByTestId, rerender } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('detail-header-button-split')).not.toBeInTheDocument();

    rerender(withAppContext(<DetailHeader {...props} links={{ self: { href: 'self' } }} />));

    expect(queryByTestId('detail-header-button-split')).toBeInTheDocument();
  });

  it('should render no split button when parent is present', () => {
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no split button when state is not m', () => {
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} status="o" />));

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no thor button when state is not m, i, b, h, send failed or reopened', () => {
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} status="o" />));

    expect(queryByTestId('detail-header-button-thor')).toBeNull();
  });

  it('test clicking the thor button', () => {
    const { queryByTestId } = render(withAppContext(<DetailHeader {...props} />));

    expect(dispatch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(queryByTestId('detail-header-button-thor'));
    });

    expect(dispatch).toHaveBeenCalledWith(patchIncident({
      id: props.incidentId,
      type: PATCH_TYPE_THOR,
      patch: {
        status: {
          state: 'ready to send',
          text: 'Te verzenden naar THOR',
          target_api: 'sigmax',
        },
      },
    }));
  });

  it('should render a link with the correct referrer', () => {
    const { getByTestId, rerender } = render(withAppContext(<DetailHeader {...props} />));

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(INCIDENTS_URL));

    const referrer = '/some-url';
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }));

    rerender(withAppContext(<DetailHeader {...props} />));

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(INCIDENTS_URL));

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer: MAP_URL,
    }));

    rerender(withAppContext(<DetailHeader {...props} />));

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(MAP_URL));
  });
});
