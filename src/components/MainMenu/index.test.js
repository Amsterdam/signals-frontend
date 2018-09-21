import React from 'react';
import { shallow } from 'enzyme';

import { MainMenu } from './index';

jest.mock('../../signals/incident/containers/IncidentContainer/actions');

describe('<MainMenu />', () => {
  let props;

  beforeEach(() => {
    props = {
      isAuthenticated: false,
      resetIncident: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render render 1 NavLink components when not authenticated', () => {
      const wrapper = shallow(<MainMenu {...props} />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render render 2 NavLink components when authenticated', () => {
      props.isAuthenticated = true;
      const wrapper = shallow(<MainMenu {...props} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should render render 1 NavLink components when not authenticated', () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const event = {
        stopPropagation: jest.fn()
      };

      wrapper.find('NavLink').simulate('click', event);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(props.resetIncident).toHaveBeenCalled();
    });
  });
});
