import React from 'react';
import {
  string2date,
  string2time,
} from 'shared/services/string-parser/string-parser';
import moment from 'moment';
import { render, fireEvent } from '@testing-library/react';
import { priorityList, statusList, stadsdeelList } from 'signals/incident-management/definitions';
import { withAppContext } from 'test/utils';

import incidents from 'utils/__tests__/fixtures/incidents.json';

import List from './index';

jest.mock('moment');
jest.mock('shared/services/string-parser/string-parser');

describe('<List />', () => {
  let props;

  beforeEach(() => {
    moment.mockImplementation(() => ({
      diff: jest.fn(),
    }));

    moment.duration.mockImplementation(() => ({
      asDays: () => 42.666,
    }));

    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:55');

    props = {
      incidents,
      priority: priorityList,
      status: statusList,
      stadsdeel: stadsdeelList,
      onChangeOrdering: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(withAppContext(<List {...props} />));

    expect(container.querySelector('tr th:nth-child(1)')).toHaveTextContent(/^Id$/)
    expect(container.querySelector('tr th:nth-child(2)')).toHaveTextContent(/^Dag$/)
    expect(container.querySelector('tr th:nth-child(3)')).toHaveTextContent(/^Datum en tijd$/)
    expect(container.querySelector('tr th:nth-child(4)')).toHaveTextContent(/^Stadsdeel$/)
    expect(container.querySelector('tr th:nth-child(5)')).toHaveTextContent(/^Subcategorie$/)
    expect(container.querySelector('tr th:nth-child(6)')).toHaveTextContent(/^Status$/)
    expect(container.querySelector('tr th:nth-child(7)')).toHaveTextContent(/^Urgentie$/)
    expect(container.querySelector('tr th:nth-child(8)')).toHaveTextContent(/^Adres$/);


    expect(container.querySelector('tr:nth-child(1) td:nth-child(1)')).toHaveTextContent(/^1668$/)
    expect(container.querySelector('tr:nth-child(1) td:nth-child(2)')).toHaveTextContent(/^-$/)
    expect(container.querySelector('tr:nth-child(1) td:nth-child(3)')).toHaveTextContent(/^21-07-1970 11:55$/)
    expect(container.querySelector('tr:nth-child(1) td:nth-child(4)')).toHaveTextContent(/^Centrum$/)
    expect(container.querySelector('tr:nth-child(1) td:nth-child(5)')).toHaveTextContent(/^Wegsleep$/)
    expect(container.querySelector('tr:nth-child(1) td:nth-child(6)')).toHaveTextContent(/^Afgehandeld$/)
    expect(container.querySelector('tr:nth-child(1) td:nth-child(7)')).toHaveTextContent(/^Normaal$/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(8)')).toHaveTextContent(/^Staalstraat 3B 1011JJ Amsterdam$/);
  });

  describe('events', () => {
    it('should sort asc the incidents when the header is clicked', () => {
      const sortedAscProps = {
        ...props,
        sort: '-created_at',
      };
      const { container } = render(withAppContext(<List {...sortedAscProps} />));

      fireEvent.click(container.querySelector('tr th:nth-child(3)'));

      expect(props.onChangeOrdering).toHaveBeenCalledWith('created_at');
    });

    it('should sort desc the incidents when the header is clicked', () => {
      const sortedDescProps = {
        ...props,
        sort: 'created_at',
      };
      const { container } = render(withAppContext(<List {...sortedDescProps} />));

      fireEvent.click(container.querySelector('tr th:nth-child(3)'));
      expect(props.onChangeOrdering).toHaveBeenCalledWith('-created_at');
    });

    it('should not show days open for specific statuses', () => {
      const incidentList = [...props.incidents];

      const incidentWithStatusA = { ...incidentList[0], status: { state: 'a' } };
      incidentWithStatusA.id = incidentList[0].id + 1;

      incidentList.push(incidentWithStatusA);

      const incidentWithStatusS = { ...incidentList[0], status: { state: 's' } };
      incidentWithStatusS.id = incidentList[0].id + 2;

      incidentList.push(incidentWithStatusS);

      const incidentWithStatusReopenRequested = {

        ...incidentList[0],
        status: { state: 'reopen requested' },
      };
      incidentWithStatusReopenRequested.id = incidentList[0].id + 3;

      incidentList.push(incidentWithStatusReopenRequested);

      const incidentWithStatusB = { ...incidentList[0], status: { state: 'b' } };
      incidentWithStatusB.id = incidentList[0].id + 4;

      incidentList.push(incidentWithStatusB);

      const listProps = { ...props };
      listProps.incidents = incidentList;

      const { getAllByTestId } = render(withAppContext(<List {...listProps} />));

      const numCells = getAllByTestId('incidentDaysOpen').length;

      expect(numCells).toEqual(incidentList.length);

      const elementsWithTextContent = Array.from(getAllByTestId('incidentDaysOpen')).filter(element => element.textContent !== '-');

      expect(elementsWithTextContent).toHaveLength(2);
    });
  });
});
