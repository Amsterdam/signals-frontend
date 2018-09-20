import React from 'react';
import { shallow } from 'enzyme';

import DateTimeInput from './index';

describe('Form component <DateTimeInput />', () => {
  const metaFields = {
    name: 'input-field-name'
  };
  let wrapper;
  let parent;

  beforeEach(() => {
    // 14.02.2017
    Date.now = jest.fn(() => 1487076708000);

    parent = {
      meta: {
        updateIncident: jest.fn()
      },
      value: {
        incident_time_hours: 9,
        incident_time_minutes: 0
      }
    };

    wrapper = shallow(<DateTimeInput
      parent={parent}
    />);
  });

  describe('rendering', () => {
    it('should render date time field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no date time field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false
        }
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('sets incident day when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: true
        }
      });

      wrapper.find('.datetime-input__earlier-day').simulate('change', { target: { value: '2018-07-21' } });

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        incident_date: '2018-07-21'
      });
    });

    it('sets incident hour when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: true
        }
      });

      wrapper.find('.datetime-input__earlier-time-hours').simulate('change', { target: { value: '13' } });

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        incident_time_hours: '13'
      });
    });

    it('sets incident minutes when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: true
        }
      });

      wrapper.find('.datetime-input__earlier-time-minutes').simulate('change', { target: { value: '42' } });

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        incident_time_minutes: '42'
      });
    });

    it('does nothing when updateIncident is false', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: false
        }
      });

      wrapper.find('.datetime-input__earlier-day').simulate('change', { target: { value: '2018-07-21' } });
      wrapper.find('.datetime-input__earlier-time-hours').simulate('change', { target: { value: '13' } });
      wrapper.find('.datetime-input__earlier-time-minutes').simulate('change', { target: { value: '42' } });

      expect(parent.meta.updateIncident).not.toHaveBeenCalled();
    });
  });
});
