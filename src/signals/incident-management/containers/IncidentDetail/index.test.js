import React from 'react';
// import { shallow } from 'enzyme';
import { fireEvent, render, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';
// import { renderHook } from '@testing-library/react-hooks';

import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';
// import categories from 'utils/__tests__/fixtures/categories_structured.json';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import historyFixture from 'utils/__tests__/fixtures/history.json';
import useEventEmitter from 'hooks/useEventEmitter';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

// import History from 'components/History';

// import DetailHeader from './components/DetailHeader';
// import MetaList from './components/MetaList';
// import AddNote from './components/AddNote';
// import LocationForm from './components/LocationForm';
// import AttachmentViewer from './components/AttachmentViewer';
// import StatusForm from './components/StatusForm';
// import Detail from './components/Detail';
// import LocationPreview from './components/LocationPreview';
// import statusList, { changeStatusOptionList } from '../../definitions/statusList';
// import stadsdeelList from '../../definitions/stadsdeelList';
// import priorityList from '../../definitions/priorityList';
// import typesList from '../../definitions/typesList';

import IncidentDetail from '.';
// import blob from './static.jpg';

// const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub);

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
      [JSON.stringify(attachments), { status: 200 }]
    );
  });

  it('should retrieve incident data', async () => {
    fetch.mockResponseOnce(JSON.stringify(incidentFixture));

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
  });

  it('should not retrieve data', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}));

    render(withAppContext(<IncidentDetail />));

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should retrieve default texts and attachments only once', async () => {
    const { findByTestId, rerender } = render(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(4);

    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(historyFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }]
    );

    rerender(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('should retrieve data when id param changes', async () => {
    const { findByTestId, rerender, unmount } = render(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(4);

    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(historyFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }]
    );

    reactRouterDom.useParams.mockImplementation(() => ({
      id: '6666',
    }));

    unmount();

    rerender(withAppContext(<IncidentDetail />));

    await findByTestId('incidentDetail');

    expect(fetch).toHaveBeenCalledTimes(8);
  });

  it('should render correctly', async () => {
    const { queryByTestId, getByTestId, findByTestId } = render(withAppContext(<IncidentDetail />));

    expect(queryByTestId('attachmentsDefinition')).not.toBeInTheDocument();
    expect(queryByTestId('history')).not.toBeInTheDocument();
    expect(queryByTestId('mapStatic')).not.toBeInTheDocument();

    await findByTestId('incidentDetail');

    expect(getByTestId('attachmentsDefinition')).toBeInTheDocument();
    expect(getByTestId('history')).toBeInTheDocument();
    expect(getByTestId('mapStatic')).toBeInTheDocument();
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

    act(() => {
      fireEvent.click(getByTestId('addNoteSaveNoteButton'));
    });

    expect(fetch).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ method: 'PATCH' }));

    await findByTestId('incidentDetail');

    // and should emit highlight event
    expect(emit).toHaveBeenCalledWith('highlight', { type: 'notes' });

    // after successful patch should request history
    expect(fetch).toHaveBeenLastCalledWith(
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

    it('should handle 400', async () => {
      const error = new Error('Could not store for some reason');
      error.status = 400;
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
            message: 'Deze wijziging is niet toegestaan in deze situatie.',
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
            message: 'Voor deze bewerking is een geautoriseerde sessie noodzakelijk',
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
            message: 'Je bent niet voldoende rechten om deze actie uit te voeren.',
          })
        )
      );
    });

    it('should handle 500', async () => {
      const error = new Error('Could not store for some reason');
      error.status = 500;
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
            message: 'Een fout op de server heeft voorkomen dat deze actie uitgevoerd kon worden. Probeer het nogmaals.',
          })
        )
      );
    });
  });
});

// describe('<IncidentDetail />', () => {
//   let wrapper;
//   let instance;
//   const props = {
//     match: {
//       params: {
//         id: '42',
//       },
//     },
//     incidentModel: {
//       loading: false,
//       patching: {},
//       defaultTexts: [],
//       error: false,
//       incident: incidentJSON,

//       attachments: [
//         {
//           _display: 'Attachment object (774)',
//           _links: {
//             self: {
//               href:
//                 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments',
//             },
//           },
//           location:
//             'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/jasper_pepper_klein.jpg?temp_url_sig=e5d22e71096db94a86e6d3d64e6bcca2b896b1f9&temp_url_expires=1569491557',
//           is_image: true,
//           created_at: '2019-09-25T16:35:59.107661+02:00',
//         },
//         {
//           _display: 'Attachment object (773)',
//           _links: {
//             self: {
//               href:
//                 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments',
//             },
//           },
//           location:
//             'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/landscape_te_klein.jpg?temp_url_sig=870025b81672f36cd0eff62d3dc78595242ba07a&temp_url_expires=1569491557',
//           is_image: true,
//           created_at: '2019-09-25T16:35:59.113090+02:00',
//         },
//       ],
//       stadsdeelList,
//       priorityList,
//       changeStatusOptionList,
//       statusList,
//       defaultTextsOptionList: statusList,
//       typesList,
//     },
//     historyModel: {
//       list: [
//         {
//           identifier: 'UPDATE_CATEGORY_ASSIGNMENT_4201',
//           when: '2019-09-25T16:35:58.871689+02:00',
//           what: 'UPDATE_CATEGORY_ASSIGNMENT',
//           action: 'Categorie gewijzigd naar: Uitwerpselen',
//           description: null,
//           who: 'SIA systeem',
//           _signal: 3254,
//         },
//         {
//           identifier: 'UPDATE_STATUS_7115',
//           when: '2019-09-25T16:35:58.870553+02:00',
//           what: 'UPDATE_STATUS',
//           action: 'Update status naar: Gemeld',
//           description: null,
//           who: 'SIA systeem',
//           _signal: 3254,
//         },
//         {
//           identifier: 'UPDATE_LOCATION_3559',
//           when: '2019-09-25T16:35:58.849857+02:00',
//           what: 'UPDATE_LOCATION',
//           action: 'Locatie gewijzigd',
//           description: 'Stadsdeel: West\nBaarsjesweg 28\nAmsterdam',
//           who: 'SIA systeem',
//           _signal: 3254,
//         },
//       ],
//     },
//     subCategories,
//     onRequestIncident: jest.fn(),
//     onPatchIncident: jest.fn(),
//     onRequestHistoryList: jest.fn(),
//     onRequestAttachments: jest.fn(),
//     onRequestDefaultTexts: jest.fn(),
//     onDismissSplitNotification: jest.fn(),
//     onDismissError: jest.fn(),
//   };

//   beforeEach(() => {
//     wrapper = shallow(<IncidentDetail {...props} />);

//     instance = wrapper.instance();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('rendering', () => {
//     it('should render default correctly', () => {
//       expect(wrapper.find(LoadingIndicator)).toHaveLength(0);

//       expect(wrapper.find(DetailHeader)).toHaveLength(1);
//       expect(wrapper.find(Detail)).toHaveLength(1);
//       expect(wrapper.find(MetaList)).toHaveLength(1);
//       expect(wrapper.find(History)).toHaveLength(1);
//       expect(wrapper.find(AddNote)).toHaveLength(1);

//       expect(wrapper.find(LocationForm)).toHaveLength(0);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
//       expect(wrapper.find(StatusForm)).toHaveLength(0);
//       expect(wrapper.find(LocationPreview)).toHaveLength(0);

//       expect(props.onRequestIncident).toHaveBeenCalledWith('42');
//       expect(props.onRequestHistoryList).toHaveBeenCalledWith('42');
//       expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
//     });

//     it('should render lazy loading correctly', () => {
//       wrapper.setProps({
//         incidentModel: {
//           ...props.incidentModel,
//           loading: true,
//         },
//       });

//       expect(wrapper.find(LoadingIndicator)).toHaveLength(1);

//       expect(wrapper.find(Detail)).toHaveLength(0);
//       expect(wrapper.find(MetaList)).toHaveLength(0);
//       expect(wrapper.find(History)).toHaveLength(0);
//       expect(wrapper.find(AddNote)).toHaveLength(0);

//       expect(wrapper.find(LocationForm)).toHaveLength(0);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
//       expect(wrapper.find(StatusForm)).toHaveLength(0);
//       expect(wrapper.find(LocationPreview)).toHaveLength(0);

//       expect(props.onRequestIncident).toHaveBeenCalledWith('42');
//       expect(props.onRequestHistoryList).toHaveBeenCalledWith('42');
//       expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
//     });

//     it('should load assets when id changes', () => {
//       expect(props.onRequestIncident).toHaveBeenCalledWith('42');
//       expect(props.onRequestHistoryList).toHaveBeenCalledWith('42');
//       expect(props.onRequestAttachments).toHaveBeenCalledWith('42');

//       wrapper.setProps({
//         match: {
//           params: {
//             id: '43',
//           },
//         },
//       });

//       expect(props.onRequestIncident).toHaveBeenCalledWith('43');
//       expect(props.onRequestHistoryList).toHaveBeenCalledWith('43');
//       expect(props.onRequestAttachments).toHaveBeenCalledWith('43');
//     });

//     it('should render StatusForm correctly', () => {
//       instance.onEditStatus();

//       expect(wrapper.find(Detail)).toHaveLength(0);
//       expect(wrapper.find(MetaList)).toHaveLength(0);
//       expect(wrapper.find(History)).toHaveLength(0);
//       expect(wrapper.find(AddNote)).toHaveLength(0);

//       expect(wrapper.find(LocationForm)).toHaveLength(0);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
//       expect(wrapper.find(StatusForm)).toHaveLength(1);
//       expect(wrapper.find(LocationPreview)).toHaveLength(0);
//     });

//     it('should render LocationForm correctly', () => {
//       instance.onEditLocation();

//       expect(wrapper.find(Detail)).toHaveLength(0);
//       expect(wrapper.find(MetaList)).toHaveLength(0);
//       expect(wrapper.find(History)).toHaveLength(0);
//       expect(wrapper.find(AddNote)).toHaveLength(0);

//       expect(wrapper.find(LocationForm)).toHaveLength(1);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
//       expect(wrapper.find(StatusForm)).toHaveLength(0);
//       expect(wrapper.find(LocationPreview)).toHaveLength(0);
//     });

//     it('should render AttachmentViewer correctly', () => {
//       instance.onShowAttachment(
//         'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/jasper_pepper_klein.jpg?temp_url_sig=e5d22e71096db94a86e6d3d64e6bcca2b896b1f9&temp_url_expires=1569491557'
//       );

//       expect(wrapper.find(Detail)).toHaveLength(0);
//       expect(wrapper.find(MetaList)).toHaveLength(0);
//       expect(wrapper.find(History)).toHaveLength(0);
//       expect(wrapper.find(AddNote)).toHaveLength(0);

//       expect(wrapper.find(LocationForm)).toHaveLength(0);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(1);
//       expect(wrapper.find(StatusForm)).toHaveLength(0);
//       expect(wrapper.find(LocationPreview)).toHaveLength(0);
//     });

//     it('should render LocationPreview and onCloseAll correctly', () => {
//       instance.onShowLocation();

//       expect(wrapper.find(Detail)).toHaveLength(0);
//       expect(wrapper.find(MetaList)).toHaveLength(0);
//       expect(wrapper.find(History)).toHaveLength(0);
//       expect(wrapper.find(AddNote)).toHaveLength(0);

//       expect(wrapper.find(LocationForm)).toHaveLength(0);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
//       expect(wrapper.find(StatusForm)).toHaveLength(0);
//       expect(wrapper.find(LocationPreview)).toHaveLength(1);

//       instance.onCloseAll();

//       expect(wrapper.find(Detail)).toHaveLength(1);
//       expect(wrapper.find(MetaList)).toHaveLength(1);
//       expect(wrapper.find(History)).toHaveLength(1);
//       expect(wrapper.find(AddNote)).toHaveLength(1);

//       expect(wrapper.find(LocationForm)).toHaveLength(0);
//       expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
//       expect(wrapper.find(StatusForm)).toHaveLength(0);
//       expect(wrapper.find(LocationPreview)).toHaveLength(0);
//     });
//   });

//   describe('events', () => {
//     it('should call 3 actions on load', () => {
//       expect(props.onRequestIncident).toHaveBeenCalledTimes(1);
//       expect(props.onRequestHistoryList).toHaveBeenCalledTimes(1);
//       expect(props.onRequestAttachments).toHaveBeenCalledTimes(1);
//     });

//     it('should re-render when incident id has changed', () => {
//       wrapper.setProps({
//         match: {
//           params: {
//             id: '43',
//           },
//         },
//       });

//       expect(props.onRequestIncident).toHaveBeenCalledTimes(2);
//     });

//     it('should fetch default texts when incident category has changed', () => {
//       wrapper.setProps({
//         incidentModel: {
//           ...props.incidentModel,
//           incident: {
//             category: { category_url: 'bar' },
//           },
//         },
//       });

//       expect(props.onRequestDefaultTexts).toHaveBeenCalledTimes(1);
//     });
//   });
// });
