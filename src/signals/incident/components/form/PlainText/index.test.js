/* eslint-disable  react/prop-types */
import React from 'react';
import { shallow } from 'enzyme';

import PlainText from '.';
import mapDynamicFields from '../../../services/map-dynamic-fields';

jest.mock('../../../services/map-dynamic-fields');

describe('Form component <PlainText />', () => {
  const MockComponent = ({ children }) => <div>{children}</div>;
  const incidentContainer = {
    incident: {
      id: 666,
    },
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
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      });

      expect(wrapper).toMatchSnapshot();
      expect(mapDynamicFields).toHaveBeenCalledWith('Lorem Ipsum', incidentContainer);
    });

    it('should render plain text citation correctly', () => {
      wrapper.setProps({
        meta: {
          value: 'Lorem Ipsum',
          type: 'citation',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      });

      expect(wrapper).toMatchSnapshot();
      expect(mapDynamicFields).toHaveBeenCalledWith('Lorem Ipsum', incidentContainer);
    });

    it('should render plain text caution correctly', () => {
      wrapper.setProps({
        meta: {
          value: 'Caution',
          type: 'caution',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      });

      expect(wrapper).toMatchSnapshot();
      expect(mapDynamicFields).toHaveBeenCalledWith('Lorem Ipsum', incidentContainer);
    });

    it('should render plain text alert correctly', () => {
      wrapper.setProps({
        meta: {
          value: 'Alert',
          type: 'alert',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
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
            <MockComponent>Foo bar</MockComponent>,
          ],
          type: 'citation',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      });

      expect(wrapper).toMatchSnapshot();

      const wrap = wrapper.find(MockComponent).shallow();
      expect(wrap).toMatchSnapshot();
    });

    it('should render no plain text when not visible', () => {
      wrapper.setProps({
        meta: {
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
