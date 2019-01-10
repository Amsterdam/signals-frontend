import React from 'react';
import { shallow } from 'enzyme';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import List from './index';

jest.mock('shared/services/string-parser/string-parser');

describe('<List />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentNotesList: [
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
    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:55');
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
    props.incidentNotesList = [];
    wrapper = shallow(
      <List {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
