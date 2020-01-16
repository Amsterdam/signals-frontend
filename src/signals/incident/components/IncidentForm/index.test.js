import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import formatConditionalForm from '../../services/format-conditional-form';
import IncidentNavigation from '../IncidentNavigation';

import IncidentForm from './index';

import phoneForm from '../../definitions/wizard-step-3-telefoon';

jest.mock('../../services/format-conditional-form/');
jest.mock('../IncidentNavigation');

const mockControl = {
  onBlur: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  setValue: jest.fn(),
};

const mockForm = {
  ...phoneForm.form,
  controls: {
    ...phoneForm.form.controls,
    phone: {
      ...mockControl,
      ...phoneForm.form.controls.phone,
      meta: {
        ...phoneForm.form.controls.phone.meta,
        isVisible: true,
      },
    },
    privacy_text: {
      ...mockControl,
      ...phoneForm.form.controls.privacy_text,
      meta: {
        ...phoneForm.form.controls.privacy_text.meta,
        isVisible: false,
      },

    },
  },
};

describe('<IncidentForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      fieldConfig: mockForm,
      incidentContainer: {
        incident: {},
      },
      wizard: { step: {} },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      isAuthenticated: false,
    };

    IncidentNavigation.mockImplementation(() => null);
    formatConditionalForm.mockImplementation(() => mockForm);
  });

  describe('rendering', () => {
    it('expect to render correctly', () => {
      const { container, queryByText, queryAllByText } = render(
        withAppContext(
          <IncidentForm {...props} />,
        ),
      );

      expect(queryByText(mockForm.controls.phone.meta.label)).toBeInTheDocument();
      expect(queryByText(mockForm.controls.phone.meta.subtitle)).toBeInTheDocument();

      expect(queryByText(mockForm.controls.privacy_text.meta.label)).not.toBeInTheDocument();

      expect(container.querySelectorAll('input').length).toEqual(1);
      expect(queryAllByText('(optioneel)').length).toEqual(1);
    });
  });

  describe.skip('events', () => {
    const event = { preventDefault: jest.fn() };
    let wrapper;
    let instance;
    let spy;

    beforeEach(() => {
      wrapper = mount(
        <IncidentForm {...props} />
      );

      instance = wrapper.instance();

      instance.form = {
        meta: {
          incident: {},
        },
        valid: true,
        controls: mockForm.controls,
        value: {},
        updateValueAndValidity: jest.fn(),
      };

      spy = jest.spyOn(instance, 'setValues');
    });

    it('clicking submit should preventDefault', () => {
      wrapper.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('expect to render correctly when form vars have changed', () => {
      expect(spy).not.toHaveBeenCalled();
      expect(instance.form.updateValueAndValidity).not.toHaveBeenCalled();

      const incidentContainer = {
        incident: {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier',
        },
      };
      wrapper.setProps({ ...props, incidentContainer });

      expect(spy).toHaveBeenCalledWith(incidentContainer.incident);
      expect(instance.form.updateValueAndValidity).toHaveBeenCalledWith();
    });

    describe('sync submit', () => {
      it('submit should trigger next when form is valid and no action defined', () => {
        const next = jest.fn();
        instance.form.valid = true;
        expect(next).not.toHaveBeenCalled();

        instance.handleSubmit(event, next);

        expect(next).toHaveBeenCalled();
      });

      it('submit should trigger next when form is valid and UPDATE_INCIDENT defined', () => {
        const next = jest.fn();
        instance.form.valid = true;
        instance.form.value = {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier',
        };
        expect(props.updateIncident).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();

        instance.handleSubmit(event, next, 'UPDATE_INCIDENT');

        expect(props.updateIncident).toHaveBeenCalledWith(instance.form.value);
        expect(next).toHaveBeenCalled();
      });

      it('submit should trigger next when form is valid and CREATE_INCIDENT defined', () => {
        const next = jest.fn();
        expect(next).not.toHaveBeenCalled();
        expect(props.createIncident).not.toHaveBeenCalled();

        instance.form.valid = true;
        instance.form.value = {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier',
        };

        instance.handleSubmit(event, next, 'CREATE_INCIDENT');

        expect(props.createIncident).toHaveBeenCalledWith({ incident: {}, isAuthenticated: false, wizard: { step: {} } });
        expect(next).toHaveBeenCalled();
      });

      it('submit should not be triggered next when form is not valid', () => {
        const next = jest.fn();
        instance.form.valid = false;

        instance.handleSubmit(event, next);

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('async submit', () => {
      it('should submit async when postponeSubmitWhenLoading is defined and no action defined', () => {
        const next = jest.fn();
        expect(next).not.toHaveBeenCalled();
        instance.form.valid = false;
        wrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
        wrapper.setProps({ mockloading: true });

        instance.handleSubmit(event, next);

        expect(wrapper.state()).toEqual({
          loading: true,
          submitting: true,
          formAction: undefined,
          next,
        });


        instance.form.valid = true;
        wrapper.setProps({ mockloading: false });

        expect(wrapper.state()).toEqual({
          loading: false,
          submitting: false,
          formAction: undefined,
          next,
        });

        expect(next).toHaveBeenCalled();
      });
    });

    it('should submit async when postponeSubmitWhenLoading is defined and action is UPDATE_INCIDENT', () => {
      const next = jest.fn();
      expect(next).not.toHaveBeenCalled();
      instance.form.valid = false;
      wrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      wrapper.setProps({ mockloading: true });

      instance.handleSubmit(event, next, 'UPDATE_INCIDENT');

      expect(wrapper.state()).toEqual({
        loading: true,
        submitting: true,
        formAction: 'UPDATE_INCIDENT',
        next,
      });


      instance.form.valid = true;
      wrapper.setProps({ mockloading: false });

      expect(wrapper.state()).toEqual({
        loading: false,
        submitting: false,
        formAction: 'UPDATE_INCIDENT',
        next,
      });

      expect(next).toHaveBeenCalled();
    });

    it('should not submit async when form is not valid after service call', () => {
      const next = jest.fn();
      instance.form.valid = false;
      wrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      wrapper.setProps({ mockloading: true });

      instance.handleSubmit(event, next);
      expect(next).not.toHaveBeenCalled();

      expect(wrapper.state()).toEqual({
        loading: true,
        submitting: true,
        formAction: undefined,
        next,
      });

      wrapper.setProps({ mockloading: false });

      expect(wrapper.state()).toEqual({
        loading: false,
        submitting: false,
        formAction: undefined,
        next,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it('should not submit async when service is not loading', () => {
      const next = jest.fn();
      instance.form.valid = false;
      wrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      wrapper.setProps({ mockloading: false });

      instance.handleSubmit(event, next);

      expect(wrapper.state()).toEqual({
        loading: false,
        submitting: false,
        formAction: '',
        next: null,
      });

      expect(next).not.toHaveBeenCalled();
    });
  });
});
