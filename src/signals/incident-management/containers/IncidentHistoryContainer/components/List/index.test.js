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
          identifier: 'UPDATE_STATUS_102798',
          when: '2018-10-09T13:44:06.224531+02:00',
          what: 'UPDATE_STATUS',
          action: 'Update status naar: Afgehandeld',
          description: 'bedankt voor uw melding we komen daar morgen voor grofvuil',
          who: 'r.poelgeest@amsterdam.nl',
          _signal: 1
        }, {
          identifier: 'UPDATE_PRIORITY_40551',
          when: '2018-10-09T13:41:37.550617+02:00',
          what: 'UPDATE_PRIORITY',
          action: 'Prioriteit update naar: Normal',
          description: null,
          who: null,
          _signal: 1
        }, {
          identifier: 'UPDATE_CATEGORY_ASSIGNMENT_67206',
          when: '2018-10-09T13:41:00.574268+02:00',
          what: 'UPDATE_CATEGORY_ASSIGNMENT',
          action: 'Categorie gewijzigd naar: Grofvuil',
          description: null,
          who: null,
          _signal: 1
        }, {
          identifier: 'UPDATE_LOCATION_40000',
          when: '2018-10-09T13:41:00.551141+02:00',
          what: 'UPDATE_LOCATION',
          action: 'Locatie gewijzigd',
          description: null,
          who: null,
          _signal: 1
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
