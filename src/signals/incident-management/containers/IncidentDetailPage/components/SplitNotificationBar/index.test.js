import React from 'react';
import { shallow } from 'enzyme';

import SplitNotificationBar from './index';

describe('<SplitNotificationBar />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      payload: {
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render 2 items correctly', () => {
    wrapper = shallow(
      <SplitNotificationBar {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render 3 items correctly', () => {
    props.payload.created.children.push({ id: 45 });
    wrapper = shallow(
      <SplitNotificationBar {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render no items correctly', () => {
    props.payload.created = undefined;
    wrapper = shallow(
      <SplitNotificationBar {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
