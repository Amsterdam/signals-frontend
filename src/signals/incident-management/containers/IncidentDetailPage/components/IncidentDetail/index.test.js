import React from 'react';
import { shallow } from 'enzyme';

import IncidentDetail from './index';
import stadsdeelList from '../../../../definitions/stadsdeelList';

describe('<IncidentDetail />', () => {
  let incident;

  beforeEach(() => {
    incident = {
      id: 17,
      source: 'Telefoon 14020',
      text: 'snel boot',
      text_extra: '',
      status: { id: 7, text: '', user: null, target_api: '', state: 'm', extern: false, extra_properties: { IP: '83.96.202.117' } },
      location: { id: 5, stadsdeel: 'A', buurt_code: 'A00c', address: { postcode: '1012BL', huisletter: 'B', huisnummer: '84', woonplaats: 'Amsterdam', openbare_ruimte: 'Geldersekade', huisnummer_toevoeging: '' }, address_text: 'Geldersekade 84B- 1012BL Amsterdam', geometrie: { type: 'Point', coordinates: [52.374231891648414, 4.901061058044434] }, extra_properties: null },
      category: { main: 'Overlast op het water', sub: 'Overlast op het water - snel varen', department: '', priority: null },
      reporter: { email: '', phone: '', remove_at: '2018-07-29T07:19:07.863608Z', created_at: '2018-07-15T07:19:08.034968Z', updated_at: '2018-07-15T07:19:08.034982Z', extra_properties: null },
      created_at: '2018-07-15T07:19:08.043593Z',
      incident_date_start: '2018-07-15T07:19:08.043554Z',
      extra_properties: { extra_boten_snelheid_rederij: 'Admiraal Heijn', extra_boten_snelheid_naamboot: 'Speranta', extra_boten_snelheid_rondvaartboot: 'Ja' }
    };
  });

  it('should render correctly', () => {
    const renderedComponent = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render correctly without extra properties', () => {
    delete incident.extra_properties;
    const renderedComponent = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} />
    );
    expect(renderedComponent.find('tr').length).toEqual(13);
    expect(renderedComponent).toMatchSnapshot();
  });
});
