import React from 'react';
import { shallow } from 'enzyme';

import { REQUEST_INCIDENT, PATCH_INCIDENT, REQUEST_ATTACHMENTS, REQUEST_DEFAULT_TEXTS, DISMISS_SPLIT_NOTIFICATION, DISMISS_ERROR } from 'models/incident/constants';
import { REQUEST_HISTORY_LIST } from 'models/history/constants';
import LoadingIndicator from 'shared/components/LoadingIndicator';

import { IncidentDetail, mapDispatchToProps } from './index';

import DetailHeader from './components/DetailHeader';
import MetaList from './components/MetaList';
import History from './components/History';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import AttachmentViewer from './components/AttachmentViewer';
import StatusForm from './components/StatusForm';
import Detail from './components/Detail';
import SplitNotificationBar from './components/SplitNotificationBar';
import LocationPreview from './components/LocationPreview';

import statusList, { changeStatusOptionList } from '../../definitions/statusList';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

describe('<IncidentDetail />', () => {
  let wrapper;
  // eslint-disable-next-line no-unused-vars
  let instance;
  const props = {
    id: '42',
    incidentModel: {
      loading: false,
      patching: {},
      defaultTexts: [],
      error: false,
      incident: {
        reporter: {
          email: '',
          phone: ''
        },
        notes: [],
        extra_properties: null,
        _display: '3254 - i - A06j - 2019-09-25 14:35:58.843458+00:00',
        priority: {
          priority: 'high',
          created_by: 'jasper.g.swart@gmail.com'
        },
        created_at: '2019-09-25T16:35:58.843458+02:00',
        has_attachments: true,
        text: 'poep',
        status: {
          text: 'In behandeling via HNW app',
          user: 'rob@apptimize.nl',
          state: 'i',
          state_display: 'In afwachting van behandeling',
          target_api: null,
          extra_properties: null,
          created_at: '2019-09-26T11:10:04.118517+02:00'
        },
        location: {
          extra_properties: {
            original_address: {
              postcode: '',
              huisletter: 'D',
              huisnummer: '342',
              woonplaats: 'Amsterdam',
              openbare_ruimte: 'Marnixstraat',
              huisnummer_toevoeging: ''
            }
          },
          geometrie: {
            type: 'Point',
            coordinates: [
              4.879088401794434,
              52.3670312505349
            ]
          },
          buurt_code: 'A06j',
          created_by: 'jasper.g.swart@gmail.com',
          address: {
            postcode: '',
            huisletter: 'D',
            huisnummer: 342,
            woonplaats: 'Amsterdam',
            openbare_ruimte: 'Marnixstraat',
            huisnummer_toevoeging: ''
          },
          stadsdeel: 'A',
          bag_validated: true,
          address_text: 'Marnixstraat 342D Amsterdam',
          id: 3566
        },
        incident_date_end: null,
        updated_at: '2019-09-26T11:10:04.119863+02:00',
        _links: {
          curies: {
            name: 'sia',
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations'
          },
          self: {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254'
          },
          archives: {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/history'
          },
          'sia:attachments': {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments'
          },
          'sia:pdf': {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/pdf'
          }
        },
        source: 'Meldkamer Handhaver',
        id: 3254,
        category: {
          sub: 'Uitwerpselen',
          sub_slug: 'hondenpoep',
          main: 'Overlast in de openbare ruimte',
          main_slug: 'overlast-in-de-openbare-ruimte',
          category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
          departments: 'STW, THO',
          created_by: null,
          text: null
        },
        incident_date_start: '2019-09-25T16:35:58+02:00',
        text_extra: ''
      },

      attachments: [
        {
          _display: 'Attachment object (774)',
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments'
            }
          },
          location: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/jasper_pepper_klein.jpg?temp_url_sig=e5d22e71096db94a86e6d3d64e6bcca2b896b1f9&temp_url_expires=1569491557',
          is_image: true,
          created_at: '2019-09-25T16:35:59.107661+02:00'
        },
        {
          _display: 'Attachment object (773)',
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments'
            }
          },
          location: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/landscape_te_klein.jpg?temp_url_sig=870025b81672f36cd0eff62d3dc78595242ba07a&temp_url_expires=1569491557',
          is_image: true,
          created_at: '2019-09-25T16:35:59.113090+02:00'
        }
      ],
      stadsdeelList,
      priorityList,
      changeStatusOptionList,
      statusList,

    },
    historyModel: {
      list: [
        {
          identifier: 'UPDATE_CATEGORY_ASSIGNMENT_4201',
          when: '2019-09-25T16:35:58.871689+02:00',
          what: 'UPDATE_CATEGORY_ASSIGNMENT',
          action: 'Categorie gewijzigd naar: Uitwerpselen',
          description: null,
          who: 'SIA systeem',
          _signal: 3254
        },
        {
          identifier: 'UPDATE_STATUS_7115',
          when: '2019-09-25T16:35:58.870553+02:00',
          what: 'UPDATE_STATUS',
          action: 'Update status naar: Gemeld',
          description: null,
          who: 'SIA systeem',
          _signal: 3254
        },
        {
          identifier: 'UPDATE_LOCATION_3559',
          when: '2019-09-25T16:35:58.849857+02:00',
          what: 'UPDATE_LOCATION',
          action: 'Locatie gewijzigd',
          description: 'Stadsdeel: West\nBaarsjesweg 28\nAmsterdam',
          who: 'SIA systeem',
          _signal: 3254
        }
      ]
    },
    categories: {
      sub: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
          value: 'Uitwerpselen',
          slug: 'hondenpoep',
          category_slug: 'overlast-in-de-openbare-ruimte',
          handling_message: '\nWe laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.'
        }
      ]
    },
    accessToken: '123',
    baseUrl: 'aaa/',

    onRequestIncident: jest.fn(),
    onPatchIncident: jest.fn(),
    onRequestHistoryList: jest.fn(),
    onRequestAttachments: jest.fn(),
    onRequestDefaultTexts: jest.fn(),
    onDismissSplitNotification: jest.fn(),
    onDismissError: jest.fn()
  };


  beforeEach(() => {
    wrapper = shallow(
      <IncidentDetail {...props} />
    );

    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('rendering', () => {
    it('should render default correctly', () => {
      expect(wrapper.find(LoadingIndicator)).toHaveLength(0);

      expect(wrapper.find(SplitNotificationBar)).toHaveLength(1);
      expect(wrapper.find(DetailHeader)).toHaveLength(1);
      expect(wrapper.find(Detail)).toHaveLength(1);
      expect(wrapper.find(MetaList)).toHaveLength(1);
      expect(wrapper.find(History)).toHaveLength(1);
      expect(wrapper.find(AddNote)).toHaveLength(1);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);
    });

    it('should render lazy loading correctly', () => {
      wrapper.setProps({
        incidentModel: {
          ...props.incidentModel,
          loading: true
        }
      });

      expect(wrapper.find(LoadingIndicator)).toHaveLength(1);

      expect(wrapper.find(Detail)).toHaveLength(0);
      expect(wrapper.find(MetaList)).toHaveLength(0);
      expect(wrapper.find(History)).toHaveLength(0);
      expect(wrapper.find(AddNote)).toHaveLength(0);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);
    });

    it('should render StatusForm correctly', () => {
      instance.onEditStatus();

      expect(wrapper.find(Detail)).toHaveLength(0);
      expect(wrapper.find(MetaList)).toHaveLength(0);
      expect(wrapper.find(History)).toHaveLength(0);
      expect(wrapper.find(AddNote)).toHaveLength(0);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(1);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);
    });

    it('should render LocationForm correctly', () => {
      instance.onEditLocation();

      expect(wrapper.find(Detail)).toHaveLength(0);
      expect(wrapper.find(MetaList)).toHaveLength(0);
      expect(wrapper.find(History)).toHaveLength(0);
      expect(wrapper.find(AddNote)).toHaveLength(0);

      expect(wrapper.find(LocationForm)).toHaveLength(1);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);
    });

    it('should render AttachmentViewer correctly', () => {
      instance.onShowAttachment('https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/jasper_pepper_klein.jpg?temp_url_sig=e5d22e71096db94a86e6d3d64e6bcca2b896b1f9&temp_url_expires=1569491557');

      expect(wrapper.find(Detail)).toHaveLength(0);
      expect(wrapper.find(MetaList)).toHaveLength(0);
      expect(wrapper.find(History)).toHaveLength(0);
      expect(wrapper.find(AddNote)).toHaveLength(0);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(1);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);
    });

    it('should render LocationPreview and onCloseAll correctly', () => {
      instance.onShowLocation();

      expect(wrapper.find(Detail)).toHaveLength(0);
      expect(wrapper.find(MetaList)).toHaveLength(0);
      expect(wrapper.find(History)).toHaveLength(0);
      expect(wrapper.find(AddNote)).toHaveLength(0);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(1);

      instance.onCloseAll();

      expect(wrapper.find(Detail)).toHaveLength(1);
      expect(wrapper.find(MetaList)).toHaveLength(1);
      expect(wrapper.find(History)).toHaveLength(1);
      expect(wrapper.find(AddNote)).toHaveLength(1);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);
    });
  });


  describe('events', () => {
    it('should call 3 actions on load', () => {
      expect(props.onRequestIncident).toHaveBeenCalledTimes(1);
      expect(props.onRequestHistoryList).toHaveBeenCalledTimes(1);
      expect(props.onRequestAttachments).toHaveBeenCalledTimes(1);
    });

    it('should re-render when incident id has changed', () => {
      wrapper.setProps({ id: '43' });

      expect(props.onRequestIncident).toHaveBeenCalledTimes(2);
    });

    it('should fetch default texts when incident category has changed', () => {
      wrapper.setProps({
        incidentModel: {
          ...props.incidentModel,
          incident: {
            category: { category_url: 'bar' }
          }
        }
      });

      expect(props.onRequestDefaultTexts).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onRequestIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENT, payload: 42 });
    });

    it('onPatchIncident', () => {
      mapDispatchToProps(dispatch).onPatchIncident({ patch: 'foo' });
      expect(dispatch).toHaveBeenCalledWith({ type: PATCH_INCIDENT, payload: { patch: 'foo' } });
    });

    it('onRequestHistoryList', () => {
      mapDispatchToProps(dispatch).onRequestHistoryList(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_HISTORY_LIST, payload: 42 });
    });

    it('onRequestAttachments', () => {
      mapDispatchToProps(dispatch).onRequestAttachments(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_ATTACHMENTS, payload: 42 });
    });

    it('onRequestDefaultTexts', () => {
      mapDispatchToProps(dispatch).onRequestDefaultTexts({ main_slug: 'afval', sub_slug: 'overige' });
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_DEFAULT_TEXTS, payload: { main_slug: 'afval', sub_slug: 'overige' } });
    });

    it('onDismissSplitNotification', () => {
      mapDispatchToProps(dispatch).onDismissSplitNotification();
      expect(dispatch).toHaveBeenCalledWith({ type: DISMISS_SPLIT_NOTIFICATION });
    });
    it('onDismissError', () => {
      mapDispatchToProps(dispatch).onDismissError();
      expect(dispatch).toHaveBeenCalledWith({ type: DISMISS_ERROR });
    });
  });
});

