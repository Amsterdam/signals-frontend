import React from 'react';
import { mount } from 'enzyme';

import IncidentForm from './index';
import formatConditionalForm from './services/format-conditional-form/';

jest.mock('./services/format-conditional-form/');

const mockForm = {
  controls: {
    phone: {
      meta: {
        label: 'Wat is uw telefoonnummer?',
        type: 'text',
        isVisible: true
      }
    },
    email: {
      meta: {
        label: 'Wat is uw email?',
        type: 'text',
        doNotUpdateValue: true,
        isVisible: true
      }
    },
    extra_boten_geluid_meer: {
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
      wizard: {},
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

    spy = jest.spyOn(instance, 'setValues');
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('expect to render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render correctly when form vars have changed', () => {
      const incidentContainer = {
        incident: {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier',
          subcategory: '(Honden)poep',
          extra_personen_overig_vaker: true,
          priority: 'high',
        }
      };
      wrapper.setProps({ incidentContainer });

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith(incidentContainer.incident);
    });
  });

  describe('events', () => {
    it('submit should trigger blur', () => {
      const event = { preventDefault: jest.fn() };
      wrapper.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
