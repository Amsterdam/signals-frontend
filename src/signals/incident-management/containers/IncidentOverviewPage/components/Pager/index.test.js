import React from 'react';
import { shallow } from 'enzyme';

import Pager from './index';

describe('<Pager />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onPageIncidentsChanged: jest.fn(),
      incidentsCount: 2350,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render default correctly', () => {
      wrapper = shallow(
        <Pager {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render page 8 correctly', () => {
      props.page = 8;

      wrapper = shallow(
        <Pager {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render last page correctly', () => {
      props.page = 24;

      wrapper = shallow(
        <Pager {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render empty correctly', () => {
      props.incidentsCount = 0;

      wrapper = shallow(
        <Pager {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      props.page = 8;

      wrapper = shallow(
        <Pager {...props} />
      );
    });

    it('should move to the second page when 2 is clicked', () => {
      wrapper.find('a').at(2).simulate('click');
      expect(props.onPageIncidentsChanged).toHaveBeenCalledWith(2);
    });

    it('should move to the page 9 when next is clicked', () => {
      wrapper.find('a').last().simulate('click');
      expect(props.onPageIncidentsChanged).toHaveBeenCalledWith(9);
    });

    it('should move to the page 7 when previous is clicked', () => {
      wrapper.find('a').first().simulate('click');
      expect(props.onPageIncidentsChanged).toHaveBeenCalledWith(7);
    });
  });
});
