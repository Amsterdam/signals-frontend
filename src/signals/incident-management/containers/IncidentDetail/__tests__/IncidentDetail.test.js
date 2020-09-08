import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';

import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import childIncidentFixture from 'utils/__tests__/fixtures/childIncidents.json';
import historyFixture from 'utils/__tests__/fixtures/history.json';
import useEventEmitter from 'hooks/useEventEmitter';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { patchIncidentSuccess } from 'signals/incident-management/actions';

import IncidentDetail from '..';

// prevent fetch requests that we don't need to verify
jest.mock('components/MapStatic', () => () => <span data-testid="mapStatic" />);

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('hooks/useEventEmitter');

const emit = jest.fn();
useEventEmitter.mockReturnValue({ listenFor: jest.fn(), unlisten: jest.fn(), emit });

const statusMessageTemplates = [
  {
    state: 'o',
    templates: [
      { title: 'Niets gevonden', text: 'Er is geen fietswrak gevonden op de aangewezen plek.' },
      {
        title: 'Zes wekenregeling',
        text: 'Dit gebied valt onder de zes wekenregeling en het fietswrak zal worden opgeruimd volgens schema.',
      },
      { title: 'Gestickerd', text: 'De fiets is gestickerd en zal worden opgehaald.' },
      { title: 'Opgeruimd', text: 'Het fietswrak is opgehaald.' },
      { title: 'Geen actie', text: 'Fiets is van een ambtenaar in functie. Die laten we dus staan.' },
    ],
  },
];

const attachments = {
  _links: {
    self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/999999/attachments' },
    next: { href: null },
    previous: { href: null },
  },
  count: 1,
  results: [
    {
      _display: 'Attachment object (980)',
      _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/999999/attachments' } },
      location: 'https://ae70d54aca324d0480ca01934240c78f.jpg',
      is_image: true,
      created_at: '2020-06-10T11:51:24.281272+02:00',
    },
  ],
};

const id = '999999';

// This test suite relies on internals of components that are rendered by the IncidentDetail container component
// to be able to ensure that closing of preview and edit views work.

describe('signals/incident-management/containers/IncidentDetail', () => {
  beforeEach(() => {
    fetch.resetMocks();
    dispatch.mockReset();
    emit.mockReset();

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id,
    }));

    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(historyFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }],
      [JSON.stringify(childIncidentFixture), { status: 200 }]
    );
  });

  it('should retrieve incident data', async () => {
    const { findByTestId } = render(withAppContext(<IncidentDetail />));

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'GET' })
    );

    expect(fetch).toHaveBeenCalledTimes(1);

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`,
      expect.objectContaining({ method: 'GET' })
    );

    const { main_slug, sub_slug } = incidentFixture.category;

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.TERMS_ENDPOINT}${main_slug}/sub_categories/${sub_slug}/status-message-templates`,
      expect.objectContaining({ method: 'GET' })
    );

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`,
      expect.objectContaining({ method: 'GET' })
    );

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/children/`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should not retrieve data', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}));

    render(withAppContext(<IncidentDetail />));

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should retrieve default texts and attachments only once', async () => {
    const { findByTestId, rerender } = render(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(5);

    rerender(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it('should not get child incidents', async () => {
    fetch.resetMocks();

    const incidentWithoutChildren = {
      ...incidentFixture,
      _links: { ...incidentFixture._links, 'sia:children': undefined },
    };

    fetch.mockResponses(
      [JSON.stringify(incidentWithoutChildren), { status: 200 }],
      [JSON.stringify(historyFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }]
    );

    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(4);

    expect(queryByTestId('childIncidents')).not.toBeInTheDocument();
  });

  it('should retrieve data when id param changes', async () => {
    const { findByTestId, rerender, unmount } = render(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(5);

    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(historyFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }],
      [JSON.stringify(childIncidentFixture), { status: 200 }]
    );

    reactRouterDom.useParams.mockImplementation(() => ({
      id: '6666',
    }));

    unmount();

    rerender(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(10);
  });

  it('should render correctly', async () => {
    const { queryByTestId, getByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    expect(queryByTestId('detail-location')).not.toBeInTheDocument();
    expect(queryByTestId('attachmentsDefinition')).not.toBeInTheDocument();
    expect(queryByTestId('history')).not.toBeInTheDocument();
    expect(queryByTestId('mapStatic')).not.toBeInTheDocument();
    expect(queryByTestId('childIncidents')).not.toBeInTheDocument();

    await findByTestId('incidentDetail');

    expect(queryByTestId('detail-location')).toBeInTheDocument();
    expect(getByTestId('attachmentsDefinition')).toBeInTheDocument();
    expect(getByTestId('history')).toBeInTheDocument();
    expect(getByTestId('mapStatic')).toBeInTheDocument();
    expect(getByTestId('childIncidents')).toBeInTheDocument();
  });

  it('should handle Escape key', async () => {
    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    const locationButtonShow = await findByTestId('previewLocationButton');

    act(() => {
      fireEvent.click(locationButtonShow);
    });

    const locationPreviewButtonEdit = await findByTestId('location-preview-button-edit');

    act(() => {
      fireEvent.click(locationPreviewButtonEdit);
    });

    await findByTestId('incidentDetail');

    act(() => {
      fireEvent.keyUp(document, { key: 'Escape', code: 13, keyCode: 13 });
    });

    await findByTestId('incidentDetail');

    expect(queryByTestId('previewLocationButton')).toBeInTheDocument();
  });

  it('should handle Esc key', async () => {
    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    const locationButtonShow = await findByTestId('previewLocationButton');

    act(() => {
      fireEvent.click(locationButtonShow);
    });

    const locationPreviewButtonEdit = await findByTestId('location-preview-button-edit');

    act(() => {
      fireEvent.click(locationPreviewButtonEdit);
    });

    await findByTestId('incidentDetail');

    act(() => {
      fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 });
    });

    await findByTestId('incidentDetail');

    expect(queryByTestId('previewLocationButton')).toBeInTheDocument();
  });

  it('should not respond to other key presses', async () => {
    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    const locationButtonShow = await findByTestId('previewLocationButton');

    act(() => {
      fireEvent.click(locationButtonShow);
    });

    const locationPreviewButtonEdit = await findByTestId('location-preview-button-edit');

    act(() => {
      fireEvent.click(locationPreviewButtonEdit);
    });

    await findByTestId('incidentDetail');

    act(() => {
      fireEvent.keyUp(document, { key: 'A', code: 65, keyCode: 65 });
    });

    await findByTestId('incidentDetail');

    expect(queryByTestId('previewLocationButton')).toBeInTheDocument();
  });

  it('renders status form', async () => {
    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    const editStatusButton = await findByTestId('editStatusButton');

    expect(queryByTestId('statusForm')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(editStatusButton);
    });

    expect(queryByTestId('statusForm')).toBeInTheDocument();
  });

  it('renders attachment viewer', async () => {
    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    const attachmentsValueButton = await findByTestId('attachmentsValueButton');

    expect(queryByTestId('attachment-viewer-image')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(attachmentsValueButton);
    });

    expect(queryByTestId('attachment-viewer-image')).toBeInTheDocument();
  });

  it('closes previews when close button is clicked', async () => {
    const { queryByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    const attachmentsValueButton = await findByTestId('attachmentsValueButton');

    expect(queryByTestId('attachment-viewer-image')).not.toBeInTheDocument();
    expect(queryByTestId('closeButton')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(attachmentsValueButton);
    });

    expect(queryByTestId('attachment-viewer-image')).toBeInTheDocument();
    expect(queryByTestId('closeButton')).toBeInTheDocument();

    act(() => {
      fireEvent.click(queryByTestId('closeButton'));
    });

    expect(queryByTestId('attachment-viewer-image')).not.toBeInTheDocument();
    expect(queryByTestId('closeButton')).not.toBeInTheDocument();
  });

  it('should handle successful PATCH', async () => {
    const { getByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    act(() => {
      fireEvent.click(getByTestId('addNoteNewNoteButton'));
    });

    act(() => {
      fireEvent.change(getByTestId('addNoteText'), { target: { value: 'Foo bar baz' } });
    });

    expect(fetch).not.toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ method: 'PATCH' }));

    fetch.mockResponseOnce(JSON.stringify(incidentFixture));

    expect(emit).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId('addNoteSaveNoteButton'));
    });

    expect(fetch).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ method: 'PATCH' }));

    await findByTestId('incidentDetail');

    // and should emit highlight event
    expect(emit).toHaveBeenCalledWith('highlight', { type: 'notes' });
    expect(dispatch).toHaveBeenCalledWith(patchIncidentSuccess());

    expect(fetch).toHaveBeenNthCalledWith(
      6,
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    // after successful patch should request history
    expect(fetch).toHaveBeenNthCalledWith(
      7,
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  describe('handling errors', () => {
    let getByTestId;
    let findByTestId;

    beforeEach(async () => {
      ({ getByTestId, findByTestId } = render(withAppContext(<IncidentDetail />)));

      await findByTestId('incidentDetail');

      act(() => {
        fireEvent.click(getByTestId('addNoteNewNoteButton'));
      });

      act(() => {
        fireEvent.change(getByTestId('addNoteText'), { target: { value: 'Foo bar baz' } });
      });

      await findByTestId('incidentDetail');
    });

    it('should handle generic', async () => {
      fetch.mockRejectOnce(new Error('Could not store for some reason'));

      expect(emit).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(getByTestId('addNoteSaveNoteButton'));
      });

      await findByTestId('incidentDetail');

      expect(emit).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification(
          expect.objectContaining({
            type: TYPE_LOCAL,
            variant: VARIANT_ERROR,
          })
        )
      );
    });

    it('should handle 401', async () => {
      const error = new Error('Could not store for some reason');
      error.status = 401;
      fetch.mockRejectOnce(error);

      expect(emit).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(getByTestId('addNoteSaveNoteButton'));
      });

      await findByTestId('incidentDetail');

      expect(emit).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification(
          expect.objectContaining({
            title: 'Geen bevoegdheid',
          })
        )
      );
    });

    it('should handle 403', async () => {
      const error = new Error('Could not store for some reason');
      error.status = 403;
      fetch.mockRejectOnce(error);

      expect(emit).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(getByTestId('addNoteSaveNoteButton'));
      });

      await findByTestId('incidentDetail');

      expect(emit).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification(
          expect.objectContaining({
            title: 'Geen bevoegdheid',
          })
        )
      );
    });
  });
});
