import React from 'react';
import { shallow } from 'enzyme';

import PlainText from './index';
import mapDynamicFields from '../../services/map-dynamic-fields';

jest.mock('../../services/map-dynamic-fields');

describe('Form component <PlainText />', () => {
  const incidentContainer = {
    incident: {
      id: 666
    }
  };
  let wrapper;

  beforeEach(() => {
    mapDynamicFields.mockImplementation(() => 'Lorem Ipsum');

    wrapper = shallow(<PlainText />);
  });

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      wrapper.setProps({
        meta: {
          value: 'Lorem Ipsum',
          type: 'citation',
          isVisible: true
        },
        parent: {
          meta: {
            incidentContainer
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
      expect(mapDynamicFields).toHaveBeenCalledWith('Lorem Ipsum', incidentContainer);
    });

    it('should render multiple parargraphs of text correctly', () => {
      wrapper.setProps({
        meta: {
          value: [
            'Lorem Ipsum',
            'jumps over',
            'DOG',
            {
              type: 'more-link',
              label: 'link label',
              href: 'http://gvb.nl'
            },
            {
              type: 'unknown-type',
              label: 'unknown label',
              href: 'http://bla.nl'
            }
          ],
          type: 'citation',
          isVisible: true
        },
        parent: {
          meta: {
            incidentContainer
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
      expect(mapDynamicFields).toHaveBeenCalledWith('Lorem Ipsum', incidentContainer);
      expect(mapDynamicFields).toHaveBeenCalledWith('jumps over', incidentContainer);
      expect(mapDynamicFields).toHaveBeenCalledWith('DOG', incidentContainer);
      expect(mapDynamicFields).toHaveBeenCalledWith('link label', incidentContainer);
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
