import React from 'react';
import { shallow } from 'enzyme';

import RedirectButton from './index';

describe('Form component <RedirectButton />', () => {
  const metaFields = {
    name: 'redirect-button',
    value: 'dit is een tekst',
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RedirectButton />);
  });

  describe('rendering', () => {
    it('should render redirect button correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render redirect button correctly array of values', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          value: ['dit is een tekst 1', 'dit is een tekst 2'],
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render redirect button correctly with button', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          buttonLabel: 'Redirect now!',
          buttonAction: 'http://somewhere.com/over/here',
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render redirect button correctly with button and redirect timeout', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          buttonLabel: 'Redirect now!',
          buttonAction: 'http://somewhere.com/over/here',
          buttonTimeout: 100,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      global.window.location.assign = jest.fn();
    });

    it('resets upload when redirect button was clicked', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          buttonLabel: 'Redirect now!',
          buttonAction: 'http://somewhere.com/over/here',
          buttonTimeout: 100,
          isVisible: true,
        },
      });

      jest.runTimersToTime(99);
      expect(global.window.location.assign).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(global.window.location.assign).toHaveBeenCalledWith('http://somewhere.com/over/here');
    });
  });
});
