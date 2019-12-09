import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { priorityList, statusList, stadsdeelList } from 'signals/incident-management/definitions';
import { withAppContext } from 'test/utils';

import incidents from 'utils/__tests__/fixtures/incidents.json';

import List from './index';

describe('<List />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidents,
      priority: priorityList,
      status: statusList,
      stadsdeel: stadsdeelList,
      onChangeOrdering: jest.fn(),
    };
  });

  it('should render correctly', () => {
    const { container } = render(withAppContext(<List {...props} />));

    expect(container.querySelector('tr th:nth-child(1)')).toHaveTextContent(/^Id$/);
    expect(container.querySelector('tr th:nth-child(2)')).toHaveTextContent(/^Dag$/);
    expect(container.querySelector('tr th:nth-child(3)')).toHaveTextContent(/^Datum en tijd$/);
    expect(container.querySelector('tr th:nth-child(4)')).toHaveTextContent(/^Stadsdeel$/);
    expect(container.querySelector('tr th:nth-child(5)')).toHaveTextContent(/^Subcategorie$/);
    expect(container.querySelector('tr th:nth-child(6)')).toHaveTextContent(/^Status$/);
    expect(container.querySelector('tr th:nth-child(7)')).toHaveTextContent(/^Urgentie$/);
    expect(container.querySelector('tr th:nth-child(8)')).toHaveTextContent(/^Adres$/);

    expect(container.querySelector('tr:nth-child(1) td:nth-child(1)')).toHaveTextContent(incidents[0].id);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(2)')).toHaveTextContent(/^-$/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(3)')).toHaveTextContent(/^03-12-2018 10:41$/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(4)')).toHaveTextContent(/^Centrum$/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(5)')).toHaveTextContent(incidents[0].category.sub);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(6)')).toHaveTextContent(incidents[0].status.state_display);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(7)')).toHaveTextContent(/^Normaal$/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(8)')).toHaveTextContent(incidents[0].location.address_text);
  });

  describe('events', () => {
    it('should sort asc the incidents when the header is clicked', () => {
      const { container } = render(withAppContext(<List {...props} sort="-created_at" />));

      expect(props.onChangeOrdering).not.toHaveBeenCalled();

      fireEvent.click(container.querySelector('tr th:nth-child(3)'));

      expect(props.onChangeOrdering).toHaveBeenCalledWith('created_at');
    });

    it('should sort desc the incidents when the header is clicked', () => {
      const { container } = render(withAppContext(<List {...props} sort="created_at" />));

      expect(props.onChangeOrdering).not.toHaveBeenCalled();

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
