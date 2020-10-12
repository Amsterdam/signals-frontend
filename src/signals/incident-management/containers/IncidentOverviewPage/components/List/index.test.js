import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import configuration from 'shared/services/configuration/configuration';
import { priorityList, statusList, stadsdeelList } from 'signals/incident-management/definitions';
import { withAppContext } from 'test/utils';

import districts from 'utils/__tests__/fixtures/districts.json';
import incidents from 'utils/__tests__/fixtures/incidents.json';
import users from 'utils/__tests__/fixtures/users.json';

import List from '.';
import IncidentManagementContext from '../../../../context';

jest.mock('shared/services/configuration/configuration');

const withContext = Component =>
  withAppContext(
    <IncidentManagementContext.Provider value={{ districts, users: users.results }}>
      {Component}
    </IncidentManagementContext.Provider>
  );

const props = {
  incidents,
  priority: priorityList,
  status: statusList,
  stadsdeel: stadsdeelList,
  onChangeOrdering: jest.fn(),
};

describe('List', () => {
  beforeEach(() => {});

  afterEach(() => {
    configuration.__reset();
    props.onChangeOrdering.mockReset();
  });

  it('should render correctly', () => {
    const { container } = render(withContext(<List {...props} />));

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
    expect(container.querySelector('tr:nth-child(1) td:nth-child(6)')).toHaveTextContent(
      incidents[0].status.state_display
    );
    expect(container.querySelector('tr:nth-child(1) td:nth-child(7)')).toHaveTextContent(/^Normaal$/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(8)')).toHaveTextContent(
      incidents[0].location.address_text
    );
  });

  it('should render nowrap correctly', () => {
    const whiteSpace = 'nowrap';
    const { container } = render(withContext(<List {...props} />));

    expect(container.querySelector('tr:nth-child(1) td:nth-child(1)')).not.toHaveStyleRule('white-space', whiteSpace);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(2)')).not.toHaveStyleRule('white-space', whiteSpace);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(3)')).toHaveStyleRule('white-space', whiteSpace);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(4)')).not.toHaveStyleRule('white-space', whiteSpace);
  });

  it('should render correctly when loading', () => {
    const opacity = '0.3';
    const { rerender, getByTestId } = render(withContext(<List {...props} />));
    expect(getByTestId('incidentOverviewListComponent')).not.toHaveStyleRule('opacity', opacity);

    rerender(withContext(<List {...{ ...props, isLoading: true }} />));
    expect(getByTestId('incidentOverviewListComponent')).toHaveStyleRule('opacity', opacity);
  });

  it('should render correctly with fetchDistrictsFromBackend', () => {
    configuration.fetchDistrictsFromBackend = true;
    configuration.language.district = 'District';

    const { container } = render(withContext(<List {...props} />));

    expect(container.querySelector('tr th:nth-child(4)')).toHaveTextContent(/^District/);
    expect(container.querySelector('tr:nth-child(1) td:nth-child(4)')).toHaveTextContent(/^North/);
    expect(container.querySelector('tr:nth-child(2) td:nth-child(4)')).toHaveTextContent(/^South/);
  });

  it('should render correctly with assignSignalToEmployee', () => {
    configuration.assignSignalToEmployee = true;

    const { container } = render(withContext(<List {...props} />));

    expect(container.querySelector('tr th:nth-child(9)')).toHaveTextContent('Toegewezen aan');
    expect(container.querySelector('tr:nth-child(1) td:nth-child(9)')).toHaveTextContent(users.results[0].username);
    expect(container.querySelector('tr:nth-child(2) td:nth-child(9)')).toHaveTextContent(/^$/);
  });

  describe('events', () => {
    it('should sort asc the incidents when the header is clicked', () => {
      const { container } = render(withContext(<List {...props} sort="-created_at" />));

      expect(props.onChangeOrdering).not.toHaveBeenCalled();

      fireEvent.click(container.querySelector('tr th:nth-child(3)'));

      expect(props.onChangeOrdering).toHaveBeenCalledWith('created_at');
    });

    it('should sort desc the incidents when the header is clicked', () => {
      const { container } = render(withContext(<List {...props} sort="created_at" />));

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

      const { getAllByTestId } = render(withContext(<List {...listProps} />));

      const numCells = getAllByTestId('incidentDaysOpen').length;

      expect(numCells).toEqual(incidentList.length);

      const elementsWithTextContent = [...getAllByTestId('incidentDaysOpen')].filter(
        element => element.textContent !== '-'
      );

      expect(elementsWithTextContent).toHaveLength(2);
    });
  });
});
