import React from 'react';
import { shallow } from 'enzyme';

import SplitNotificationBar from './index';

describe('<SplitNotificationBar />', () => {
  let wrapper;
  let props;


  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('success', () => {
    beforeEach(() => {
      props = {
        data: {
          id: '42',
          created: {
            children: [
              { id: 43 },
              { id: 44 }
            ]
          }
        },
        onClose: jest.fn()
      };
    });

    it('should render 2  items correctly', () => {
      wrapper = shallow(
        <SplitNotificationBar {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render 3 items correctly', () => {
      props.data.created.children.push({ id: 45 });
      wrapper = shallow(
        <SplitNotificationBar {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no items correctly', () => {
      props.data.created = undefined;
      wrapper = shallow(
        <SplitNotificationBar {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('error', () => {
    beforeEach(() => {
      props = {
        data: {
          response: {
            status: 503
          }
        },
        onClose: jest.fn()
      };
    });

    it('should render general error correctly', () => {
      wrapper = shallow(
        <SplitNotificationBar {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render general 403 correctly', () => {
      props.data.response.status = 403;
      wrapper = shallow(
        <SplitNotificationBar {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render general 412 correctly', () => {
      props.data.response.status = 412;
      wrapper = shallow(
        <SplitNotificationBar {...props} />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
