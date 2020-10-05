import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { ChevronUp, ChevronDown } from '@datapunt/asc-assets';
import { Icon } from '@datapunt/asc-ui';

import { string2date, string2time } from 'shared/services/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import * as types from 'shared/types';
import configuration from 'shared/services/configuration/configuration';
import { statusList } from 'signals/incident-management/definitions';

import IncidentManagementContext from '../../../../context';

const getDaysOpen = incident => {
  const statusesWithoutDaysOpen = statusList
    .filter(({ shows_remaining_sla_days }) => shows_remaining_sla_days === false)
    .map(({ key }) => key);
  const hasDaysOpen = incident.status && !statusesWithoutDaysOpen.includes(incident.status.state);
  const start = hasDaysOpen && parseISO(incident.created_at);
  return hasDaysOpen ? -differenceInCalendarDays(start, new Date()) : '-';
};

const Wrapper = styled.div`
  width: 100%;

  ${({ isLoading }) =>
    isLoading &&
    css`
      opacity: 0.3;
    `}
`;

const Table = styled.table`
  border-collapse: separate;
  width: 100%;
  height: 100%;

  td {
    padding: 0;

    a {
      text-decoration: none;
      color: black;
      display: block;
      width: 100%;
      height: 100%;
      padding: 8px;
    }
  }

  tr:hover td,
  td {
    box-shadow: unset;
  }
`;

const Th = styled.th`
  font-weight: normal;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  ${props => {
    // making sure that both text and icon are placed on one line by setting explicit min-width values
    switch (props['data-testid']) {
      case 'sortId':
        return 'min-width: 75px;';

      case 'sortDaysOpen':
        return 'min-width: 65px;';

      case 'sortCreatedAt':
      case 'sortStadsdeel':
        return 'min-width: 150px;';

      case 'sortSubcategory':
        return 'min-width: 135px;';

      case 'sortPriority':
        return 'min-width: 100px;';

      case 'sortAddress':
        return 'min-width: 80px;';

      default:
        return 'width: auto;';
    }
  }}
`;

const List = ({ className, incidents, isLoading, onChangeOrdering, priority, sort, stadsdeel, status }) => {
  const { districts } = useContext(IncidentManagementContext);

  const onSort = useCallback(
    newSort => () => {
      const sortIsAsc = sort?.indexOf(newSort) === 0;
      onChangeOrdering(sortIsAsc ? `-${newSort}` : newSort);
    },
    [onChangeOrdering, sort]
  );

  const renderChevron = useCallback(
    column => {
      const currentSort = sort?.split(',')[0];
      const isColumnSorted = currentSort?.indexOf(column) > -1;
      const sortDirection = currentSort?.charAt(0) === '-' ? 'down' : 'up';

      return isColumnSorted ? (
        <Icon inline size={12}>
          {sortDirection === 'up' ? <ChevronDown /> : <ChevronUp />}
        </Icon>
      ) : null;
    },
    [sort]
  );

  return (
    <Wrapper isLoading={isLoading} className={className} data-testid="incidentOverviewListComponent">
      <Table cellSpacing="0">
        <thead>
          <tr>
            <Th data-testid="sortId" onClick={onSort('id')}>
              Id {renderChevron('id')}
            </Th>
            <Th data-testid="sortDaysOpen" onClick={onSort('days_open')}>
              Dag {renderChevron('days_open')}
            </Th>
            <Th data-testid="sortCreatedAt" onClick={onSort('created_at')}>
              Datum en tijd {renderChevron('created_at')}
            </Th>
            {configuration.fetchDistrictsFromBackend ? (
              <Th data-testid="sortDistrict" onClick={onSort('district,-created_at')}>
                {configuration.language.district} {renderChevron('district')}
              </Th>
            ) : (
              <Th data-testid="sortStadsdeel" onClick={onSort('stadsdeel,-created_at')}>
                Stadsdeel {renderChevron('stadsdeel')}
              </Th>
            )}
            <Th data-testid="sortSubcategory" onClick={onSort('sub_category,-created_at')}>
              Subcategorie {renderChevron('sub_category')}
            </Th>
            <Th data-testid="sortStatus" onClick={onSort('status,-created_at')}>
              Status {renderChevron('status')}
            </Th>
            <Th data-testid="sortPriority" onClick={onSort('priority,-created_at')}>
              Urgentie {renderChevron('priority')}
            </Th>
            <Th data-testid="sortAddress" onClick={onSort('address,-created_at')}>
              Adres {renderChevron('address')}
            </Th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => {
            const detailLink = `/manage/incident/${incident.id}`;
            return (
              <tr key={incident.id}>
                <td>
                  <Link to={detailLink}>{incident.id}</Link>
                </td>
                <td data-testid="incidentDaysOpen">
                  <Link to={detailLink}>{getDaysOpen(incident)}</Link>
                </td>
                <td className="no-wrap">
                  <Link to={detailLink}>
                    {string2date(incident.created_at)} {string2time(incident.created_at)}
                  </Link>
                </td>
                <td>
                  <Link to={detailLink}>
                    {configuration.fetchDistrictsFromBackend
                      ? getListValueByKey(districts, incident.location && incident.location.area_code)
                      : getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}
                  </Link>
                </td>
                <td>
                  <Link to={detailLink}>{incident.category && incident.category.sub}</Link>
                </td>
                <td>
                  <Link to={detailLink}>{getListValueByKey(status, incident.status && incident.status.state)}</Link>
                </td>
                <td>
                  <Link to={detailLink}>
                    {getListValueByKey(priority, incident.priority && incident.priority.priority)}
                  </Link>
                </td>
                <td>
                  <Link to={detailLink}>{incident.location && incident.location.address_text}</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Wrapper>
  );
};

List.defaultProps = {
  className: '',
  isLoading: false,
};

List.propTypes = {
  className: PropTypes.string,
  incidents: PropTypes.arrayOf(types.incidentType).isRequired,
  onChangeOrdering: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  priority: types.dataListType.isRequired,
  sort: PropTypes.string,
  stadsdeel: types.dataListType.isRequired,
  status: types.dataListType.isRequired,
};

export default List;
