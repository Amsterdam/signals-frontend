import React from 'react';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { Wizard, Step, Steps } from 'react-albus';
import formatConditionalForm from '../../services/format-conditional-form';

import IncidentForm, { Form } from './index';

import phoneForm from '../../definitions/wizard-step-3-telefoon';

jest.mock('../../services/format-conditional-form/');

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
    $field_0: {
      ...mockControl,
      ...phoneForm.form.controls.$field_0,
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
      wizard: { telefoon: phoneForm },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
    };

    formatConditionalForm.mockImplementation(() => mockForm);
  });

  describe('rendering', () => {
    it('expect to render correctly', () => {
      const { container, queryByText } = render(
        withAppContext(
          <Wizard>
            <Steps>
              <Step id="incident/telefoon">
                <IncidentForm {...props} />
              </Step>
            </Steps>
          </Wizard>
        ),
      );

      expect(queryByText(mockForm.controls.phone.meta.label)).toBeInTheDocument();
      expect(queryByText(mockForm.controls.phone.meta.subtitle)).toBeInTheDocument();

      expect(queryByText(mockForm.controls.privacy_text.meta.label)).not.toBeInTheDocument();

      expect(container.querySelectorAll('input').length).toEqual(1);

      expect(queryByText(phoneForm.nextButtonLabel)).toBeInTheDocument();
      expect(queryByText(phoneForm.previousButtonLabel)).toBeInTheDocument();
    });
  });

  describe('events', () => {
    const event = { preventDefault: jest.fn() };
    let wrapper;
    let instance;
    let spy;
    let formWrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Wizard>
          <Steps>
            <Step id="incident/telefoon">
              <IncidentForm {...props} />
            </Step>
          </Steps>
        </Wizard>
      );

      formWrapper = wrapper.find(IncidentForm).dive();

      instance = formWrapper.instance();

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
      formWrapper.find(Form).simulate('submit', event);

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

      formWrapper.setProps({ ...props, incidentContainer });

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

        expect(props.updateIncident).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();

        instance.handleSubmit(event, next, 'UPDATE_INCIDENT');

        expect(props.updateIncident).toHaveBeenCalledWith(instance.form.value);
        expect(next).toHaveBeenCalled();
      });

      it('submit should trigger next when form is valid and CREATE_INCIDENT defined', () => {
        const next = jest.fn();
        instance.form.valid = true;

        expect(next).not.toHaveBeenCalled();
        expect(props.createIncident).not.toHaveBeenCalled();

        instance.handleSubmit(event, next, 'CREATE_INCIDENT');

        expect(props.createIncident).toHaveBeenCalledWith(expect.objectContaining({ incident: {} }));
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
        formWrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
        formWrapper.setProps({ mockloading: true });

        instance.handleSubmit(event, next);

        expect(formWrapper.state()).toEqual({
          loading: true,
          submitting: true,
          formAction: undefined,
          next,
        });

        instance.form.valid = true;
        formWrapper.setProps({ mockloading: false });

        expect(formWrapper.state()).toEqual({
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
      formWrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      formWrapper.setProps({ mockloading: true });

      instance.handleSubmit(event, next, 'UPDATE_INCIDENT');

      expect(formWrapper.state()).toEqual({
        loading: true,
        submitting: true,
        formAction: 'UPDATE_INCIDENT',
        next,
      });

      instance.form.valid = true;
      formWrapper.setProps({ mockloading: false });

      expect(formWrapper.state()).toEqual({
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
      formWrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      formWrapper.setProps({ mockloading: true });

      instance.handleSubmit(event, next);
      expect(next).not.toHaveBeenCalled();

      expect(formWrapper.state()).toEqual({
        loading: true,
        submitting: true,
        formAction: undefined,
        next,
      });

      formWrapper.setProps({ mockloading: false });

      expect(formWrapper.state()).toEqual({
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
      formWrapper.setProps({ postponeSubmitWhenLoading: 'mockloading' });
      formWrapper.setProps({ mockloading: false });

      instance.handleSubmit(event, next);

      expect(formWrapper.state()).toEqual({
        loading: false,
        submitting: false,
        formAction: '',
        next: null,
      });

      expect(next).not.toHaveBeenCalled();
    });
  });
});
