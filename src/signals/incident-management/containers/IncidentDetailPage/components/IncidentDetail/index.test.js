import React from 'react';
import { shallow } from 'enzyme';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import IncidentDetail, { HIGHLIGHT_TIMEOUT_INTERVAL } from './index';
import priorityList from '../../../../definitions/priorityList';
import stadsdeelList from '../../../../definitions/stadsdeelList';

jest.mock('shared/services/string-parser/string-parser');

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
      priority: { priority: 'normal' },
      reporter: { email: '', phone: '', remove_at: '2018-07-29T07:19:07.863608Z', created_at: '2018-07-15T07:19:08.034968Z', updated_at: '2018-07-15T07:19:08.034982Z', extra_properties: null },
      created_at: '2018-07-15T07:19:08.043593Z',
      incident_date_start: '2018-07-15T07:19:08.043554Z'
    };

    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:55');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with extra properties', () => {
    incident.extra_properties = [
      {
        id: 'extra_straatverlichting',
        label: 'Gaat uw melding over één of over meer lampen?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: {
          id: 'meer_lampen',
          label: 'Meer lampen'
        }
      },
      {
        id: 'extra_straatverlichting_wat',
        label: 'Wat is er aan de hand met de lamp(en)?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: [{ id: 'brandt_niet', label: 'Brandt niet' }, { id: 'brandt_overdag', label: 'Brandt overdag' }]
      },
      {
        id: 'extra_straatverlichting_nummer',
        label: 'Hebt u een nummer van (één van) de lamp(en)?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: '42'
      },
      {
        id: 'extra_bedrijven_vaker',
        label: 'Gebeurt het vaker?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: { label: 'Ja, het gebeurt vaker', value: true }
      }
    ];
    const wrapper = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when address is missing', () => {
    incident.location.address_text = undefined;
    const wrapper = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with parent', () => {
    incident.parent_id = '42';
    const wrapper = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with children', () => {
    incident.child_ids = ['43', '44', '45'];
    const wrapper = shallow(
      <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
    );
    expect(wrapper).toMatchSnapshot();
  });
  describe('highlighting', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should render correctly with highlight location', () => {
      const wrapper = shallow(
        <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
      );
      wrapper.setProps({
        incident: {
          ...incident,
          location: {
            has: 'changed'
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state('locationUpdated')).toEqual(true);

      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL - 1);
      expect(wrapper.state('locationUpdated')).toEqual(true);

      jest.runTimersToTime(1);
      expect(wrapper.state('locationUpdated')).toEqual(false);
    });

    it('should render correctly with highlight stadsdeel', () => {
      const wrapper = shallow(
        <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
      );
      wrapper.setProps({
        incident: {
          ...incident,
          location: {
            stadsdeel: 'M'
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state('stadsdeelUpdated')).toEqual(true);

      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL - 1);
      expect(wrapper.state('stadsdeelUpdated')).toEqual(true);

      jest.runTimersToTime(1);
      expect(wrapper.state('stadsdeelUpdated')).toEqual(false);
    });
  });

  describe('unmounting', () => {
    let originalClearTimeout;

    beforeEach(() => {
      originalClearTimeout = global.window.clearTimeout;
      global.window.clearTimeout = jest.fn();
      jest.useFakeTimers();
    });

    afterEach(() => {
      global.window.clearTimeout = originalClearTimeout;
    });

    it('should unmount  with no open timers', () => {
      const wrapper = shallow(
        <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
      );

      wrapper.unmount();
      expect(global.window.clearTimeout).toHaveBeenCalledTimes(0);
    });

    it('should reset timer when unmounting with open location timer', () => {
      const wrapper = shallow(
        <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
      );
      wrapper.setProps({
        incident: {
          ...incident,
          location: {
            has: 'changed',
            stadsdeel: 'A'
          }
        }
      });
      expect(wrapper.state('locationUpdated')).toEqual(true);

      wrapper.unmount();
      expect(global.window.clearTimeout).toHaveBeenCalledTimes(1);
    });

    it('should reset timer when unmounting with open stadsdeel timer', () => {
      const wrapper = shallow(
        <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
      );
      wrapper.setProps({
        incident: {
          ...incident,
          location: {
            ...incident.location,
            stadsdeel: 'M'
          }
        }
      });
      expect(wrapper.state('stadsdeelUpdated')).toEqual(true);

      wrapper.unmount();
      expect(global.window.clearTimeout).toHaveBeenCalledTimes(2);
    });
  });
});
