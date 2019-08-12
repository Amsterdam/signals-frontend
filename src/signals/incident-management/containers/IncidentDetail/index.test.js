import React from 'react';
import { shallow } from 'enzyme';

import { REQUEST_INCIDENT, PATCH_INCIDENT, REQUEST_ATTACHMENTS, REQUEST_DEFAULT_TEXTS, DISMISS_SPLIT_NOTIFICATION, DISMISS_ERROR } from 'models/incident/constants';
import { REQUEST_HISTORY_LIST } from 'models/history/constants';

import { IncidentDetail, mapDispatchToProps } from './index';

jest.mock('shared/components/LoadingIndicator', () => () => <div className="loading-indicator" />);
jest.mock('./components/SplitNotificationBar', () => () => <div className="split-notification-bar" />);
jest.mock('./components/DetailHeader', () => () => <div className="detail-header" />);
jest.mock('./components/MetaList', () => () => <div className="meta-list" />);
jest.mock('./components/History', () => () => <div className="history" />);
jest.mock('./components/AddNote', () => () => <div className="add-note" />);
jest.mock('./components/LocationForm', () => () => <div className="location-form" />);
jest.mock('./components/AttachmentViewer', () => () => <div className="attachment-viewer" />);
jest.mock('./components/StatusForm', () => () => <div className="status-form" />);
jest.mock('./components/Detail', () => () => <div className="detail" />);
jest.mock('./components/LocationPreview', () => () => <div className="location-preview" />);

describe('<IncidentDetail />', () => {
  let wrapper;
  let props;
  // eslint-disable-next-line no-unused-vars
  let instance;

  beforeEach(() => {
    props = {
      id: '42',
      incidentModel: {
        incident: {
          id: 42,
          status: {
            state: 'm'
          },
          category: {
            category_url: 'foo'
          }
        },
        attachments: [],
        stadsdeelList: [],
        changeStatusOptionList: [],
        statusList: [],
        defaultTexts: [],
        priorityList: [],
        loading: false,
        patching: {},
        error: false,
      },
      historyModel: {
        list: []
      },
      categories: {},
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

    wrapper = shallow(
      <IncidentDetail {...props} />
    );

    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('rendering', () => {
    it('should render correctly', () => {
      //  TODO
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

