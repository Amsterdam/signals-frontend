/* eslint-disable  react/prop-types */
import React from 'react';
import { shallow } from 'enzyme';

import HandlingMessage from '.';

describe('Form component <HandlingMessage />', () => {
  const incidentContainer = {
    incident: {
      handling_message: 'Jaaaaa!\n\nNeee!',
    },
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HandlingMessage />);
  });

  describe('rendering', () => {
    it('should render handling message correctly', () => {
      wrapper.setProps({
        meta: {
          key: 'incident.handling_message',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render empty correctly with no handling message', () => {
      const emptyIncidentContainer = {
        incident: {
        },
      };

      wrapper.setProps({
        meta: {
          key: 'incident.handling_message',
          isVisible: true,
        },
        parent: {
          meta: {
            emptyIncidentContainer,
          },
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no handling message when not visible', () => {
      wrapper.setProps({
        meta: {
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
