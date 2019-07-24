import React from 'react';
import { mount } from 'enzyme';
import defer from 'lodash.defer';


import IncidentForm from './index';
import formatConditionalForm from '../../services/format-conditional-form/';

jest.mock('../../services/format-conditional-form/');

const mockControl = {
  onBlur: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  setValue: jest.fn()
};

const mockForm = {
  controls: {
    phone: {
      ...mockControl,
      meta: {
        label: 'Wat is uw telefoonnummer?',
        type: 'text',
        isVisible: true
      }
    },
    email: {
      ...mockControl,
      meta: {
        label: 'Wat is uw email?',
        type: 'text',
        doNotUpdateValue: true,
        isVisible: true
      }
    },
    extra_boten_geluid_meer: {
      ...mockControl,
      meta: {
        label: 'Zijn er nog dingen die u ons nog meer kunt vertellen?',
        isVisible: false
      }
    }
  }
};

describe('<IncidentForm />', () => {
  let props;
  let wrapper;
  let instance;
  let spy;

  beforeEach(() => {
    props = {
      fieldConfig: {
        controls: {}
      },
      incidentContainer: {
        incident: {}
      },
      wizard: { step: {} },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      isAuthenticated: false
    };

    formatConditionalForm.mockImplementation(() => mockForm);
    jest.useFakeTimers();

    wrapper = mount(
      <IncidentForm {...props} />
    );

    instance = wrapper.instance();

    instance.form = {
      meta: {
        incident: {}
      },
      valid: true,
      controls: mockForm.controls,
      value: {}
    };

    spy = jest.spyOn(instance, 'setValues');
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    // sss
    it('expect to render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render correctly when form vars have changed', () => {
      const incidentContainer = {
        incident: {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier'
        }
      };
      wrapper.setProps({ incidentContainer });

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith(incidentContainer.incident);
    });
  });

  describe('events', () => {
    const event = { preventDefault: jest.fn() };

    it('clicking submit should preventDefault', () => {
      wrapper.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    describe('sync submit', () => {
      it('submit should trigger next when form is valid and no action defined', () => {
        const next = jest.fn();
        instance.form.valid = true;

        instance.handleSubmit(event, next);

        expect(next).toHaveBeenCalled();
      });

      it('submit should trigger next when form is valid and UPDATE_INCIDENT defined', () => {
        const next = jest.fn();
        instance.form.valid = true;
        instance.form.value = {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier'
        };

        instance.handleSubmit(event, next, 'UPDATE_INCIDENT');

        expect(props.updateIncident).toHaveBeenCalledWith(instance.form.value);
        expect(next).toHaveBeenCalled();
      });

      it('submit should trigger next when form is valid and CREATE_INCIDENT defined', () => {
        const next = jest.fn();
        instance.form.valid = true;
        instance.form.value = {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier'
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
        instance.form.valid = false;
        wrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
        wrapper.setProps({ mockloading: true });

        instance.handleSubmit(event, next);

        expect(wrapper.state()).toEqual({
          loading: true,
          submitting: true,
          formAction: undefined,
          next
        });


        instance.form.valid = true;
        wrapper.setProps({ mockloading: false });

        expect(wrapper.state()).toEqual({
          loading: false,
          submitting: false,
          formAction: undefined,
          next
        });

        defer(() => {
          expect(next).toHaveBeenCalled();
        });
      });
    });

    it('should submit async when postponeSubmitWhenLoading is defined and action is UPDATE_INCIDENT', () => {
      const next = jest.fn();
      instance.form.valid = false;
      wrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      wrapper.setProps({ mockloading: true });

      instance.handleSubmit(event, next, 'UPDATE_INCIDENT');

      expect(wrapper.state()).toEqual({
        loading: true,
        submitting: true,
        formAction: 'UPDATE_INCIDENT',
        next
      });


      instance.form.valid = true;
      wrapper.setProps({ mockloading: false });

      expect(wrapper.state()).toEqual({
        loading: false,
        submitting: false,
        formAction: 'UPDATE_INCIDENT',
        next
      });

      defer(() => {
        expect(next).toHaveBeenCalled();
      });
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
        next
      });

      wrapper.setProps({ mockloading: false });

      expect(wrapper.state()).toEqual({
        loading: false,
        submitting: false,
        formAction: undefined,
        next
      });

      defer(() => {
        expect(next).not.toHaveBeenCalled();
      });
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
        next: null
      });

      defer(() => {
        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});
