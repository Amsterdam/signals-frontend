import React from 'react';
import { shallow } from 'enzyme';

import { FieldGroup } from 'react-reactive-form';

import StatusForm from './index';

import statusList, { changeStatusOptionList } from '../../../../definitions/statusList';

jest.mock('./components/DefaultTexts', () => () => <div data-testid="status-form-default-texts" />);

describe('<StatusForm />', () => {
  let wrapper;
  let props;
  let instance;

  beforeEach(() => {
    props = {
      incident: {
        id: 42,
        status: {
          state: 'm',
        },
      },
      patching: { location: false },
      error: false,
      changeStatusOptionList,
      statusList,
      defaultTexts: [],
      onPatchIncident: jest.fn(),
      onDismissError: jest.fn(),
      onClose: jest.fn(),
    };
  });

  const getComponent = prps => {
    const wrap = shallow(
      <StatusForm {...prps} />
    );

    const inst = wrap.instance();

    return [wrap, inst];
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should contain the FieldGroup', () => {
    [wrapper, instance] = getComponent(props);

    expect(wrapper.find(FieldGroup)).toHaveLength(1);
    expect(props.onDismissError).toHaveBeenCalledTimes(1);
  });

  it('should contain render unauthorized error', () => {
    props.error = {
      response: {
        status: 403,
      },
    };

    [wrapper, instance] = getComponent(props);
    const renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();

    expect(renderedFormGroup.find('.status-form__error').text()).toBe('Je bent niet geautoriseerd om dit te doen.');
  });

  it('should contain render other error', () => {
    props.error = {
      response: {
        status: 400,
      },
    };

    [wrapper, instance] = getComponent(props);

    const renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();

    expect(renderedFormGroup.find('.status-form__error').text()).toBe('De gekozen status is niet mogelijk in deze situatie.');
  });


  it('should contain loading indicator when patching error', () => {
    props.patching = {
      status: true,
    };

    [wrapper, instance] = getComponent(props);

    const renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();

    expect(renderedFormGroup.exists('.status-form__submit--progress')).toBe(true);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      [wrapper, instance] = getComponent(props);

      renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
    });

    it('should render form correctly', () => {
      expect(renderedFormGroup.find('.status-form__form-status')).toHaveLength(1);
      expect(renderedFormGroup.find('.status-form__form-text')).toHaveLength(1);

      expect(renderedFormGroup.find('.status-form__form-submit')).toHaveLength(1);
      expect(renderedFormGroup.find('.status-form__form-cancel')).toHaveLength(1);
    });

    it('should disable the submit button when no status has been selected', () => {
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a status has been selected', () => {
      const form = instance.form;
      const formValue = {
        status: 'b',
      };
      form.patchValue(formValue);
      expect(form.value.status).toEqual(formValue.status);
      expect(form.value.coordinates).toEqual(formValue.coordinates);
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(false);
    });

    it('should enable the submit button when a status with a mandatory text have been selected', () => {
      const form = instance.form;
      const newStatus = {
        status: 'o',
      };
      form.patchValue(newStatus);
      expect(form.value.status).toEqual(newStatus.status);
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(true);

      const newText = {
        text: 'bla',
      };
      form.patchValue(newText);
      expect(form.value.text).toEqual(newText.text);
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(false);
    });

    it('should set default text when it has triggered', () => {
      instance.handleUseDefaultText({ preventDefault: jest.fn() }, 'default text');

      expect(instance.form.value.text).toEqual('default text');
    });

    it('should call patch status when the form is submitted (submit button is clicked)', () => {
      const form = instance.form;
      const formValues = {
        status: 'o',
        text: 'boooooo',
      };
      form.patchValue(formValues);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      expect(props.onPatchIncident).toHaveBeenCalledWith({
        id: 42,
        patch: {
          status: {
            state: 'o',
            text: 'boooooo',
          },
        },
        type: 'status',
      });
    });

    it('should close the location form when result is ok', () => {
      wrapper.setProps({
        patching: { status: true },
      });

      wrapper.setProps({
        patching: { status: false },
        error: { response: { ok: true } },
      });

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close the location form when result triggers an error', () => {
      wrapper.setProps({
        patching: { status: true },
      });

      wrapper.setProps({
        patching: { status: false },
        error: { response: { ok: false, status: 500 } },
      });

      expect(props.onClose).not.toHaveBeenCalled();
    });
  });
});
//
