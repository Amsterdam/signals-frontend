import React from 'react';
import { shallow } from 'enzyme';

import PlainText from './index';

describe('Form component <PlainText />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlainText />);
  });

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      wrapper.setProps({
        meta: {
          value: 'Lorem Ipsum',
          type: 'citation',
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render multiple parargraphs of text correctly', () => {
      wrapper.setProps({
        meta: {
          value: [
            'Lorem Ipsum',
            'jumps over',
            'DOG'
          ],
          type: 'citation',
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render plain text with text substitution correctly', () => {
      wrapper.setProps({
        meta: {
          value: 'Diablo {incident.id}',
          type: 'citation',
          isVisible: true
        },
        parent: {
          meta: {
            incidentContainer: {
              incident: {
                id: 666
              }
            }
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render multiple parargraphs of text with substitution correctly', () => {
      wrapper.setProps({
        meta: {
          value: [
            'Lorem Ipsum',
            'hell {incident.id} YES',
            'DOG'
          ],
          type: 'citation',
          isVisible: true
        },
        parent: {
          meta: {
            incidentContainer: {
              incident: {
                id: 666
              }
            }
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
