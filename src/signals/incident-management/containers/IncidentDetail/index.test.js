import React from 'react';
import { shallow } from 'enzyme';

import { REQUEST_INCIDENT, PATCH_INCIDENT, REQUEST_ATTACHMENTS, REQUEST_DEFAULT_TEXTS, DISMISS_SPLIT_NOTIFICATION, DISMISS_ERROR } from 'models/incident/constants';
import { REQUEST_HISTORY_LIST } from 'models/history/constants';

// import { FieldGroup } from 'react-reactive-form';

import { IncidentDetail, mapDispatchToProps } from './index';

// import SplitNotificationBar from './components/SplitNotificationBar';

// jest.mock('shared/services/map-location');
jest.mock('./components/SplitNotificationBar', () => () => <div className="splitNotification-bar" />);
jest.mock('./components/DetailHeader', () => () => <div className="detail-header" />);
jest.mock('./components/MetaList', () => () => <div className="meta-list" />);
jest.mock('./components/History', () => () => <div className="history" />);
jest.mock('./components/AddNote', () => () => <div className="add-note" />);
jest.mock('./components/LocationForm', () => () => <div className="location-form" />);
jest.mock('./components/AttachmentViewer', () => () => <div className="attachmentV-viewer" />);
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
      incidentModel: {
        incident: {
          id: 42,
          status: {
            state: 'm'
          }
        }
      },
      historyModel: {},
      patching: { location: false },
      error: false,
      categories: {},
      accessToken: '123',
      baseUrl: 'aaa/',
      attachments: [],
      id: '42',
      stadsdeelList: [],
      changeStatusOptionList: [],
      statusList: [],
      defaultTexts: [],
      priorityList: [],
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

  it('should call 3 actions', () => {
    expect(props.onRequestIncident).toHaveBeenCalledTimes(1);
    expect(props.onRequestHistoryList).toHaveBeenCalledTimes(1);
    expect(props.onRequestAttachments).toHaveBeenCalledTimes(1);
  });

  // describe('FieldGroup', () => {
  //   let renderedFormGroup;

  //   beforeEach(() => {
  //     renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
  //   });

  //   it('should render form correctly', () => {
  //     expect(renderedFormGroup.find('.status-form__form-status')).toHaveLength(1);
  //     expect(renderedFormGroup.find('.status-form__form-text')).toHaveLength(1);

  //     expect(renderedFormGroup.find('.status-form__form-submit')).toHaveLength(1);
  //     expect(renderedFormGroup.find('.status-form__form-cancel')).toHaveLength(1);
  //   });

  //   it('should disable the submit button when no status has been selected', () => {
  //     expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(true);
  //   });

  //   it('should enable the submit button when a status has been selected', () => {
  //     const form = instance.form;
  //     const formValue = {
  //       status: 'b'
  //     };
  //     form.patchValue(formValue);
  //     expect(form.value.status).toEqual(formValue.status);
  //     expect(form.value.coordinates).toEqual(formValue.coordinates);
  //     expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(false);
  //   });

  //   it('should enable the submit button when a status with a mandatory text have been selected', () => {
  //     const form = instance.form;
  //     const newStatus = {
  //       status: 'o'
  //     };
  //     form.patchValue(newStatus);
  //     expect(form.value.status).toEqual(newStatus.status);
  //     expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(true);

  //     const newText = {
  //       text: 'bla'
  //     };
  //     form.patchValue(newText);
  //     expect(form.value.text).toEqual(newText.text);
  //     expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(false);
  //   });

  //   it('should set default text when it has triggered', () => {
  //     instance.handleUseDefaultText({ preventDefault: jest.fn() }, 'default text');

  //     expect(instance.form.value.text).toEqual('default text');
  //   });

  //   it('should call patch status when the form is submitted (submit button is clicked)', () => {
  //     const form = instance.form;
  //     const formValues = {
  //       status: 'o',
  //       text: 'boooooo'
  //     };
  //     form.patchValue(formValues);

  //     // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
  //     renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
  //     expect(props.onPatchIncident).toHaveBeenCalledWith({
  //       id: 42,
  //       patch: {
  //         status: {
  //           state: 'o',
  //           text: 'boooooo'
  //         }
  //       },
  //       type: 'status'
  //     });
  //   });

  //   it('should close the location form when result is ok', () => {
  //     wrapper.setProps({
  //       patching: { status: true }
  //     });

  //     wrapper.setProps({
  //       patching: { status: false },
  //       error: { response: { ok: true } }
  //     });

  //     expect(props.onClose).toHaveBeenCalledTimes(1);
  //   });

  //   it('should not close the location form when result triggers an error', () => {
  //     wrapper.setProps({
  //       patching: { status: true }
  //     });

  //     wrapper.setProps({
  //       patching: { status: false },
  //       error: { response: { ok: false, status: 500 } }
  //     });

  //     expect(props.onClose).not.toHaveBeenCalled();
  //   });
  // });

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

