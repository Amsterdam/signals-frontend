import React from 'react';
import { shallow } from 'enzyme';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import categories from 'utils/__tests__/fixtures/categories_structured.json';
import incidentJSON from 'utils/__tests__/fixtures/incident.json';

import History from 'components/History';
import { IncidentDetail } from '.';

import DetailHeader from './components/DetailHeader';
import MetaList from './components/MetaList';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import AttachmentViewer from './components/AttachmentViewer';
import StatusForm from './components/StatusForm';
import Detail from './components/Detail';
import LocationPreview from './components/LocationPreview';
import statusList, {
  changeStatusOptionList,
} from '../../definitions/statusList';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';
import typesList from '../../definitions/typesList';

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub);

describe('<IncidentDetail />', () => {
  let wrapper;
  let instance;
  const props = {
    match: {
      params: {
        id: '42',
      },
    },
    incidentModel: {
      loading: false,
      patching: {},
      defaultTexts: [],
      error: false,
      incident: incidentJSON,

      attachments: [
        {
          _display: 'Attachment object (774)',
          _links: {
            self: {
              href:
                'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments',
            },
          },
          location:
            'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/jasper_pepper_klein.jpg?temp_url_sig=e5d22e71096db94a86e6d3d64e6bcca2b896b1f9&temp_url_expires=1569491557',
          is_image: true,
          created_at: '2019-09-25T16:35:59.107661+02:00',
        },
        {
          _display: 'Attachment object (773)',
          _links: {
            self: {
              href:
                'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3254/attachments',
            },
          },
          location:
            'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/landscape_te_klein.jpg?temp_url_sig=870025b81672f36cd0eff62d3dc78595242ba07a&temp_url_expires=1569491557',
          is_image: true,
          created_at: '2019-09-25T16:35:59.113090+02:00',
        },
      ],
      stadsdeelList,
      priorityList,
      changeStatusOptionList,
      statusList,
      defaultTextsOptionList: statusList,
      typesList,
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
          _signal: 3254,
        },
        {
          identifier: 'UPDATE_STATUS_7115',
          when: '2019-09-25T16:35:58.870553+02:00',
          what: 'UPDATE_STATUS',
          action: 'Update status naar: Gemeld',
          description: null,
          who: 'SIA systeem',
          _signal: 3254,
        },
        {
          identifier: 'UPDATE_LOCATION_3559',
          when: '2019-09-25T16:35:58.849857+02:00',
          what: 'UPDATE_LOCATION',
          action: 'Locatie gewijzigd',
          description: 'Stadsdeel: West\nBaarsjesweg 28\nAmsterdam',
          who: 'SIA systeem',
          _signal: 3254,
        },
      ],
    },
    subCategories,
    onRequestIncident: jest.fn(),
    onPatchIncident: jest.fn(),
    onRequestHistoryList: jest.fn(),
    onRequestAttachments: jest.fn(),
    onRequestDefaultTexts: jest.fn(),
    onDismissSplitNotification: jest.fn(),
    onDismissError: jest.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(<IncidentDetail {...props} />);

    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render default correctly', () => {
      expect(wrapper.find(LoadingIndicator)).toHaveLength(0);

      expect(wrapper.find(DetailHeader)).toHaveLength(1);
      expect(wrapper.find(Detail)).toHaveLength(1);
      expect(wrapper.find(MetaList)).toHaveLength(1);
      expect(wrapper.find(History)).toHaveLength(1);
      expect(wrapper.find(AddNote)).toHaveLength(1);

      expect(wrapper.find(LocationForm)).toHaveLength(0);
      expect(wrapper.find(AttachmentViewer)).toHaveLength(0);
      expect(wrapper.find(StatusForm)).toHaveLength(0);
      expect(wrapper.find(LocationPreview)).toHaveLength(0);

      expect(props.onRequestIncident).toHaveBeenCalledWith('42');
      expect(props.onRequestHistoryList).toHaveBeenCalledWith('42');
      expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
    });

    it('should render lazy loading correctly', () => {
      wrapper.setProps({
        incidentModel: {
          ...props.incidentModel,
          loading: true,
        },
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

      expect(props.onRequestIncident).toHaveBeenCalledWith('42');
      expect(props.onRequestHistoryList).toHaveBeenCalledWith('42');
      expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
    });

    it('should load assets when id changes', () => {
      expect(props.onRequestIncident).toHaveBeenCalledWith('42');
      expect(props.onRequestHistoryList).toHaveBeenCalledWith('42');
      expect(props.onRequestAttachments).toHaveBeenCalledWith('42');

      wrapper.setProps({
        match: {
          params: {
            id: '43',
          },
        },
      });

      expect(props.onRequestIncident).toHaveBeenCalledWith('43');
      expect(props.onRequestHistoryList).toHaveBeenCalledWith('43');
      expect(props.onRequestAttachments).toHaveBeenCalledWith('43');
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
      instance.onShowAttachment(
        'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/09/25/jasper_pepper_klein.jpg?temp_url_sig=e5d22e71096db94a86e6d3d64e6bcca2b896b1f9&temp_url_expires=1569491557'
      );

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
      wrapper.setProps({
        match: {
          params: {
            id: '43',
          },
        },
      });

      expect(props.onRequestIncident).toHaveBeenCalledTimes(2);
    });

    it('should fetch default texts when incident category has changed', () => {
      wrapper.setProps({
        incidentModel: {
          ...props.incidentModel,
          incident: {
            category: { category_url: 'bar' },
          },
        },
      });

      expect(props.onRequestDefaultTexts).toHaveBeenCalledTimes(1);
    });
  });
});
