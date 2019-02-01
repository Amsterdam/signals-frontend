import React from 'react';
import { shallow } from 'enzyme';
import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import moment from 'moment';

import List from './index';

jest.mock('moment');
jest.mock('shared/services/string-parser/string-parser');

describe('<List />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    moment.mockImplementation(() => ({
      diff: jest.fn()
    }));

    moment.duration.mockImplementation(() => ({
      asDays: () => 42.666
    }));

    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:55');

    props = {
      incidents: [
        {
          reporter: {
            email: 'p.lippmann@amsterdam.nl',
            phone: '',
            extra_properties: null
          },
          extra_properties: null,
          _display: '1668 - o - A04h - 2018-12-03 09:41:43.012139+00:00',
          priority: {
            priority: 'normal'
          },
          created_at: '2018-12-03T10:41:43.012139+01:00',
          text: 'Grofvuil gedumpt',
          notes_count: 0,
          signal_id: '84c8125c-6162-4504-9932-d2eec88d4053',
          status: {
            text: ',m,',
            user: 's.l.kok@amsterdam.nl',
            state: 'o',
            state_display: 'Afgehandeld',
            extra_properties: null,
            created_at: '2018-12-03T10:44:10.162204+01:00'
          },
          location: {
            id: 1638,
            stadsdeel: 'A',
            buurt_code: 'A04h',
            address: {
              postcode: '1011JJ',
              huisletter: 'B',
              huisnummer: '3',
              woonplaats: 'Amsterdam',
              openbare_ruimte: 'Staalstraat',
              huisnummer_toevoeging: ''
            },
            address_text: 'Staalstraat 3B 1011JJ Amsterdam',
            geometrie: {
              type: 'Point',
              coordinates: [
                4.896941184997559,
                52.368364148255644
              ]
            },
            extra_properties: null
          },
          incident_date_end: null,
          updated_at: '2018-12-03T12:53:51.589712+01:00',
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/auth/signal/1668/'
            }
          },
          source: 'Telefoon – ASC',
          id: 1668,
          image: null,
          operational_date: null,
          category: {
            sub: 'Wegsleep',
            sub_slug: 'wegsleep',
            main: 'Overlast in de openbare ruimte',
            main_slug: 'overlast-in-de-openbare-ruimte',
            department: 'ASC, CCA, THO'
          },
          incident_date_start: '2018-12-03T10:41:42+01:00',
          text_extra: ''
        },
        {
          reporter: {
            email: '',
            phone: '',
            extra_properties: null
          },
          extra_properties: null,
          _display: '1667 - m - A04h - 2018-11-29 22:03:19.398904+00:00',
          priority: {
            priority: 'normal'
          },
          created_at: '2018-11-29T23:03:19.398904+01:00',
          text: 'poep',
          notes_count: 0,
          signal_id: '323c11d0-a196-432d-96aa-a07895d81ace',
          status: {
            text: null,
            user: null,
            state: 'm',
            state_display: 'Gemeld',
            extra_properties: {},
            created_at: '2018-11-29T23:03:19.566082+01:00'
          },
          location: {
            id: 1637,
            stadsdeel: 'K',
            buurt_code: 'A04h',
            address: {
              postcode: '1011KJ',
              huisletter: '',
              huisnummer: '45',
              woonplaats: 'Amsterdam',
              openbare_ruimte: 'Raamgracht',
              huisnummer_toevoeging: ''
            },
            address_text: 'Raamgracht 45 1011KJ Amsterdam',
            geometrie: {
              type: 'Point',
              coordinates: [
                4.900460243225099,
                52.3692814746251
              ]
            },
            extra_properties: null
          },
          incident_date_end: null,
          updated_at: '2018-11-29T23:05:52.590923+01:00',
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/auth/signal/1667/'
            }
          },
          source: 'Telefoon – CCA',
          id: 1667,
          image: null,
          operational_date: null,
          category: {
            sub: 'Dode dieren',
            sub_slug: 'dode-dieren',
            main: 'Overlast van dieren',
            main_slug: 'overlast-van-dieren',
            department: 'ASC, CCA, GGD'
          },
          incident_date_start: '2018-11-29T23:03:19+01:00',
          text_extra: ''
        }
      ],
      priorityList: [
        {
          key: 'normal',
          value: 'Normaal'
        },
        {
          key: 'high',
          value: 'Hoog'
        }
      ],
      statusList: [
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
        },
        {
          key: 'reopened',
          value: 'Heropend'
        },
        {
          key: 'ready to send',
          value: 'Extern: te verzenden'
        },
        {
          key: 'sent',
          value: 'Extern: verzonden'
        },
        {
          key: 'send failed',
          value: 'Extern: mislukt'
        },
        {
          key: 'done external',
          value: 'Extern: afgehandeld'
        }
      ],
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
      ],
      incidentSelected: jest.fn(),
      onRequestIncidents: jest.fn()
    };

    wrapper = shallow(
      <List {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('events', () => {
    it('should select the incident when the row is clicked', () => {
      wrapper.find('tbody > tr').at(1).simulate('click');
      expect(props.incidentSelected).toHaveBeenCalledWith(props.incidents[1]);
    });

    it('should sort asc the incidents when the header is clicked', () => {
      wrapper.setProps({
        sort: '-created_at'
      });

      wrapper.find('thead > tr > th').at(2).simulate('click');
      expect(props.onRequestIncidents).toHaveBeenCalledWith({ sort: 'created_at' });
    });

    it('should sort desc the incidents when the header is clicked', () => {
      wrapper.setProps({
        sort: 'created_at'
      });

      wrapper.find('thead > tr > th').at(2).simulate('click');
      expect(props.onRequestIncidents).toHaveBeenCalledWith({ sort: '-created_at' });
    });
  });
});
