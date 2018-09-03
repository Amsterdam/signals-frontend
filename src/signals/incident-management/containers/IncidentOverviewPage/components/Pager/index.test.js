import React from 'react';
import { shallow } from 'enzyme';

import Pager from './index';

describe('<Pager />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    props = {
      onPageChanged: jest.fn(),
      incidentsCount: 2350
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render default correctly', () => {
      renderedComponent = shallow(
        <Pager {...props} />
      );

      expect(renderedComponent).toMatchSnapshot();
    });

    it('should render page 8 correctly', () => {
      props.page = 8;

      renderedComponent = shallow(
        <Pager {...props} />
      );

      expect(renderedComponent).toMatchSnapshot();
    });

    it('should render last page correctly', () => {
      props.page = 24;

      renderedComponent = shallow(
        <Pager {...props} />
      );

      expect(renderedComponent).toMatchSnapshot();
    });

    it('should render empty correctly', () => {
      props.incidentsCount = 0;

      renderedComponent = shallow(
        <Pager {...props} />
      );

      expect(renderedComponent).toMatchSnapshot();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      props.page = 8;

      renderedComponent = shallow(
        <Pager {...props} />
      );
    });

    it('should move to the second page when 2 is clicked', () => {
      renderedComponent.find('a').at(2).simulate('click');
      expect(props.onPageChanged).toHaveBeenCalledWith(2);
    });

    it('should move to the page 9 when next is clicked', () => {
      renderedComponent.find('a').last().simulate('click');
      expect(props.onPageChanged).toHaveBeenCalledWith(9);
    });

    it('should move to the page 7 when previous is clicked', () => {
      renderedComponent.find('a').first().simulate('click');
      expect(props.onPageChanged).toHaveBeenCalledWith(7);
    });
  });
});
