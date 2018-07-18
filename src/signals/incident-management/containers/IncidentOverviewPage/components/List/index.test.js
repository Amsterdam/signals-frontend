import React from 'react';
import { shallow } from 'enzyme';

import List from './index';

describe('<List />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    props = {
      incidents: [{ id: 158, signal_id: 'bdd90784-6093-449e-bacb-bec415446b6c', source: 'api', text: 'poep', text_extra: 'extra_boten_snelheid_rondvaartboot: Ja, extra_boten_snelheid_rederij: Aemstelland', status: { id: 187, text: 'test sophie', user: 'S.Raeymaekers@amsterdam.nl', target_api: '', state: 'i', extern: false, extra_properties: { IP: '194.13.133.3' } }, location: { id: 155, stadsdeel: 'A', buurt_code: 'abc', address: { postcode: '1012JS', huisletter: 'A', huisnummer: '1', woonplaats: 'Amsterdam', openbare_ruimte: 'Dam', huisnummer_toevoeging: '1' }, address_text: 'Dam 1A-1 1012JS Amsterdam', geometrie: { type: 'Point', coordinates: [52.36227330330391, 4.930282384157181] }, extra_properties: {} }, category: { main: '', sub: 'Gezonken boot', department: '', priority: null }, reporter: { email: 'a@b.com', phone: '020654321', remove_at: '2018-07-25T13:46:10.035176Z', created_at: '2018-07-11T13:46:10.072042Z', updated_at: '2018-07-11T13:46:10.072057Z', extra_properties: null }, created_at: '2018-07-11T13:46:10.073510Z', updated_at: null, incident_date_start: '2018-07-11T13:46:10.073488Z', incident_date_end: null, operational_date: null, image: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/images/2018/07/11/2.7mb_afbeeling_l1b9nqX.jpg?temp_url_sig=126bd0830babcf7717e44b613861c70a25c1e557&temp_url_expires=1531407297', extra_properties: null }],
      statusList: [],
      stadsdeelList: [],
      incidentSelected: jest.fn()
    };

    renderedComponent = shallow(
      <List {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should contain one incident', () => {
    expect(renderedComponent.find('tbody > tr').length).toEqual(1);
  });

  it('should select the incident when the row is clicked', () => {
    renderedComponent.find('tbody > tr').simulate('click');
    expect(props.incidentSelected).toHaveBeenCalledWith(props.incidents[0]);
  });
});
