import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext } from 'test/utils';
import { MAP_URL, INCIDENTS_URL } from 'signals/incident-management/routes';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import { PATCH_TYPE_THOR } from '../../constants';

import IncidentDetailContext from '../../context';
import DetailHeader from '.';

jest.mock('./components/DownloadButton', () => props => <div data-testid="detail-header-button-download" {...props} />);

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    referrer: undefined,
  }),
}));

const update = jest.fn();

const renderWithContext = (incident = incidentFixture) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update }}>
      <DetailHeader />
    </IncidentDetailContext.Provider>
  );

describe('signals/incident-management/containers/IncidentDetail/components/DetailHeader', () => {
  beforeEach(() => {
    update.mockReset();
  });

  it('should render parent link', () => {
    const { queryByTestId, rerender } = render(renderWithContext());

    expect(queryByTestId('parentLink')).not.toBeInTheDocument();

    rerender(
      renderWithContext({
        ...incidentFixture,
        _links: { ...incidentFixture._links, 'sia:parent': { href: '//href-to-parent/5678' } },
      })
    );

    expect(queryByTestId('parentLink')).toBeInTheDocument();
    expect(queryByTestId('parentLink').href).toEqual(expect.stringContaining('5678'));
  });

  it('should render all buttons when state is gemeld and no parent or children are present', () => {
    const { queryByTestId, queryAllByTestId, unmount } = render(renderWithContext());

    expect(queryByTestId('backlink')).toHaveTextContent(/^Terug naar overzicht$/);
    expect(queryByTestId('detail-header-title')).toHaveTextContent(`Melding ${incidentFixture.id}`);
    expect(queryByTestId('detail-header-button-thor')).toHaveTextContent(/^THOR$/);
    expect(queryAllByTestId('detail-header-button-download')).toHaveLength(1);

    unmount();
  });

  it('should render no split button when 10 or more children are present', () => {
    const { queryByTestId, rerender, unmount } = render(renderWithContext());

    expect(queryByTestId('detail-header-button-split')).toBeInTheDocument();

    unmount();

    rerender(
      renderWithContext({
        ...incidentFixture,
        _links: { ...incidentFixture._links, 'sia:parent': undefined, 'sia:children': [...Array(8)] },
      })
    );

    expect(queryByTestId('detail-header-button-split')).toBeInTheDocument();

    unmount();

    rerender(
      renderWithContext({
        ...incidentFixture,
        _links: { ...incidentFixture._links, 'sia:parent': undefined, 'sia:children': [...Array(10)] },
      })
    );

    expect(queryByTestId('detail-header-button-split')).not.toBeInTheDocument();
  });

  it('should render no split button when parent is present', () => {
    const { queryByTestId } = render(
      renderWithContext({
        ...incidentFixture,
        _links: { ...incidentFixture._links, 'sia:parent': { href: '//href-to-parent/5678' } },
      })
    );

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no split button when state is o', () => {
    const { queryByTestId } = render(
      renderWithContext({ ...incidentFixture, status: { ...incidentFixture.status, state: 'o' } })
    );

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no split button when state a', () => {
    const { queryByTestId } = render(
      renderWithContext({ ...incidentFixture, status: { ...incidentFixture.status, state: 'a' } })
    );

    expect(queryByTestId('detail-header-button-split')).toBeNull();
  });

  it('should render no thor button when state is not m, i, b, h, send failed or reopened', () => {
    const { queryByTestId } = render(
      renderWithContext({
        ...incidentFixture,
        status: { ...incidentFixture.status, state: 'o' },
      })
    );

    expect(queryByTestId('detail-header-button-thor')).toBeNull();
  });

  it('test clicking the thor button', () => {
    const { queryByTestId } = render(renderWithContext());

    expect(update).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(queryByTestId('detail-header-button-thor'));
    });

    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_THOR,
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
    const { getByTestId, rerender } = render(renderWithContext());

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(INCIDENTS_URL));

    const referrer = '/some-url';
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }));

    rerender(renderWithContext());

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(INCIDENTS_URL));

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer: MAP_URL,
    }));

    rerender(renderWithContext());

    expect(getByTestId('backlink').href).toEqual(expect.stringContaining(MAP_URL));
  });
});
