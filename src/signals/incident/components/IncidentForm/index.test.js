import React from 'react';
import { mount } from 'enzyme';

import IncidentForm from './index';
import formatConditionalForm from './services/format-conditional-form/';

jest.mock('./services/format-conditional-form/');

describe('<IncidentForm />', () => {
  let props;

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

    formatConditionalForm.mockImplementation(() => ({
      controls: {}
    }));

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('expect to render correctly', () => {
      const wrapper = mount(
        <IncidentForm {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render correctly when form vars have changed', () => {
      const wrapper = mount(
        <IncidentForm {...props} />
      );

      wrapper.setProps({
        incident: {
          phone: '06987654321',
          extra_boten_geluid_meer: 'Ja! Wat een teringzooi hier',
          subcategory: '(Honden)poep',
          extra_personen_overig_vaker: true,
          priority: 'high',
        }
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('submit of normal step should update incident data', () => {
      const wrapper = mount(
        <IncidentForm {...props} />
      );
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn(), stepId: 'incident/beschrijf' });

      expect(props.updateIncident).toHaveBeenCalled();
    });

    it('submit of samenvatting step should create an incident', () => {
      const wrapper = mount(
        <IncidentForm {...props} />
      );
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn(), stepId: 'incident/samenvatting' });

      expect(props.createIncident).toHaveBeenCalled();
    });
  });
});
