import React from 'react';
import { shallow } from 'enzyme';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import List from './index';

jest.mock('shared/services/string-parser/string-parser');

describe('<List />', () => {
  const statusList = [
    {
      key: '',
      value: 'Alle statussen'
    },
    {
      key: 'm',
      value: 'Gemeld'
    },
    {
      key: 'i',
      value: 'In afwachting van behandeling'
    },
    {
      key: 'b',
      value: 'In behandeling'
    },
    {
      key: 'o',
      value: 'Afgehandeld'
    },
    {
      key: 'h',
      value: 'On hold'
    },
    {
      key: 'a',
      value: 'Geannuleerd'
    }
  ];
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      statusList,
      incidentStatusList: [
        {
          _links: { self: { href: '3' } },
          text: '',
          user: null,
          extern: false,
          state: 'm',
          created_at: '2018-07-13T11:48:45.555774+02:00'
        },
        {
          _links: { self: { href: '910' } },
          text: 'een tekst',
          user: 'opleiding@amsterdam.nl',
          extern: false,
          state: 'i',
          created_at: '2018-07-27T14:53:19.394361+02:00'
        },
        {
          _links: { self: { href: '911' } },
          text: 'is opgeruimd',
          user: '',
          state: 'o',
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
    props.incidentStatusList = [];
    wrapper = shallow(
      <List {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
