import React from 'react';
import { shallow } from 'enzyme';

import SplitDetail from './index';

describe('<SplitDetail />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    // moment.mockImplementation(() => ({
    //   format: () => 'vrijdag 11 januari 2019'
    // }));

    props = {
      incident: {
        reporter: {
          email: '',
          phone: ''
        },
        created_at: '2019-01-11T20:06:34.382725+01:00',
        text: 'patrick sonneveldt werd aan gevalen door een reuzen octopus',
        location: {
          id: 1682,
          stadsdeel: null,
          buurt_code: null,
          address: null,
          address_text: '',
          geometrie: {
            type: 'Point',
            coordinates: [
              5.102806091308594,
              52.413437741869494
            ]
          },
          extra_properties: null
        },
        incident_date_end: null,
        updated_at: '2019-01-11T20:06:35.441604+01:00',
        source: 'Meldkamer Politie',
        id: 1712,
        category: {
          sub: 'Overig',
          sub_slug: 'overig',
          main: 'Overig',
          main_slug: 'overig',
          department: 'ASC, CCA'
        },
        incident_date_start: '2019-01-11T20:06:34+01:00'
      },
      stadsdeelList: [
        {
          key: 'A',
          value: 'Centrum'
        },
        {
          key: 'B',
          value: 'Westpoort'
        },
        {
          key: 'E',
          value: 'West'
        },
        {
          key: 'M',
          value: 'Oost'
        },
        {
          key: 'N',
          value: 'Noord'
        },
        {
          key: 'T',
          value: 'Zuidoost'
        },
        {
          key: 'K',
          value: 'Zuid'
        },
        {
          key: 'F',
          value: 'Nieuw-West'
        }
      ]
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    wrapper = shallow(
      <SplitDetail {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with phone and email', () => {
    props.incident.reporter.phone = '0206793793';
    props.incident.reporter.email = 'sinter@klaas.es';
    wrapper = shallow(
      <SplitDetail {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render empty when incident is undefined', () => {
    props.incident = undefined;
    wrapper = shallow(
      <SplitDetail {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
