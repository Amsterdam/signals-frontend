import React from 'react';
import { shallow } from 'enzyme';

import List from './index';

describe('<List />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentHistoryList: [
        {
          _links: { self: { href: '3' } },
          text: 'Note 1',
          user: null,
          created_at: '2018-07-13T11:48:45.555774+02:00'
        },
        {
          _links: { self: { href: '910' } },
          text: 'Note 2',
          user: 'opleiding@amsterdam.nl',
          created_at: '2018-07-27T14:53:19.394361+02:00'
        },
        {
          _links: { self: { href: '911' } },
          text: 'Note 3',
          user: '',
          created_at: '2018-07-27T14:53:35.989951+02:00'
        }
      ]
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    wrapper = shallow(
      <List {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render without list correctly', () => {
    props.incidentHistoryList = [];
    wrapper = shallow(
      <List {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
