import React from 'react';
import { shallow } from 'enzyme';

import Thor from './index';

describe('<Thor />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: '333',
      currentState: 'm',
      onRequestStatusCreate: jest.fn()
    };

    wrapper = shallow(
      <Thor {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly while loading', () => {
      wrapper.setProps({
        loading: true
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should render correctly', () => {
      wrapper.find('button').simulate('click');
      expect(props.onRequestStatusCreate).toHaveBeenCalled();
    });
  });
});
