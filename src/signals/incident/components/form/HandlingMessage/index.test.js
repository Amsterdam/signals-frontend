/* eslint-disable  react/prop-types */
import React from 'react';
import { shallow } from 'enzyme';

import HandlingMessage from './index';

describe('Form component <HandlingMessage />', () => {
  const incidentContainer = {
    incident: {
      handling_message: 'Jaaaaa!\n\nNeee!'
    }
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HandlingMessage />);
  });

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      wrapper.setProps({
        meta: {
          key: 'incident.handling_message',
          isVisible: true
        },
        parent: {
          meta: {
            incidentContainer
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no plain text when not visible', () => {
      wrapper.setProps({
        meta: {
          isVisible: false
        }
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
