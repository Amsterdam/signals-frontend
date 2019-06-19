import React from 'react';
import { shallow } from 'enzyme';

import { MainMenu, mapDispatchToProps } from './index';
import { RESET_INCIDENT } from '../../signals/incident/containers/IncidentContainer/constants';

describe('<MainMenu />', () => {
  let props;

  beforeEach(() => {
    props = {
      isAuthenticated: false,
      resetIncident: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render 1 NavLink components when not authenticated', () => {
      const wrapper = shallow(<MainMenu {...props} />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render 2 NavLink components when authenticated', () => {
      props.isAuthenticated = true;
      const wrapper = shallow(<MainMenu {...props} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should resetIncident when button is clicked', () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const event = {
        stopPropagation: jest.fn()
      };

      wrapper.find('NavLink').simulate('click', event);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(props.resetIncident).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should get classification', () => {
      mapDispatchToProps(dispatch).resetIncident();
      expect(dispatch).toHaveBeenCalledWith({ type: RESET_INCIDENT });
    });
  });
});
