import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
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

import * as S from './List.styles';
import IncidentManagementContext from '../../../../context';

const getDaysOpen = incident => {
  const statusesWithoutDaysOpen = statusList
    .filter(({ shows_remaining_sla_days }) => shows_remaining_sla_days === false)
    .map(({ key }) => key);
  const hasDaysOpen = incident.status && !statusesWithoutDaysOpen.includes(incident.status.state);
  const start = hasDaysOpen && parseISO(incident.created_at);
  return hasDaysOpen ? -differenceInCalendarDays(start, new Date()) : '-';
};

const List = ({
  className = '',
  incidents,
  isLoading = false,
  onChangeOrdering,
  priority,
  sort,
  stadsdeel,
  status,
}) => {
  const { districts, users } = useContext(IncidentManagementContext);

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

  const getAssignedUserName = useCallback(userId => users?.find(user => user.id === userId)?.username, [users]);

  return (
    <S.List isLoading={isLoading} className={className} data-testid="incidentOverviewListComponent">
      <S.Table cellSpacing="0">
        <thead>
          <tr>
            <S.Th data-testid="sortId" onClick={onSort('id')}>
              Id {renderChevron('id')}
            </S.Th>
            <S.Th data-testid="sortDaysOpen" onClick={onSort('days_open')}>
              Dag {renderChevron('days_open')}
            </S.Th>
            <S.Th data-testid="sortCreatedAt" onClick={onSort('created_at')}>
              Datum en tijd {renderChevron('created_at')}
            </S.Th>
            {configuration.fetchDistrictsFromBackend ? (
              <S.Th data-testid="sortDistrict" onClick={onSort('district,-created_at')}>
                {configuration.language.district} {renderChevron('district')}
              </S.Th>
            ) : (
              <S.Th data-testid="sortStadsdeel" onClick={onSort('stadsdeel,-created_at')}>
                Stadsdeel {renderChevron('stadsdeel')}
              </S.Th>
            )}
            <S.Th data-testid="sortSubcategory" onClick={onSort('sub_category,-created_at')}>
              Subcategorie {renderChevron('sub_category')}
            </S.Th>
            <S.Th data-testid="sortStatus" onClick={onSort('status,-created_at')}>
              Status {renderChevron('status')}
            </S.Th>
            <S.Th data-testid="sortPriority" onClick={onSort('priority,-created_at')}>
              Urgentie {renderChevron('priority')}
            </S.Th>
            <S.Th data-testid="sortAddress" onClick={onSort('address,-created_at')}>
              Adres {renderChevron('address')}
            </S.Th>
            {users && <th data-testid="sortAssigedUserId">Toegewezen aan</th>}
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => {
            const detailLink = `/manage/incident/${incident.id}`;
            return (
              <tr key={incident.id}>
                <S.Td>
                  <Link to={detailLink}>{incident.id}</Link>
                </S.Td>
                <S.Td data-testid="incidentDaysOpen">
                  <Link to={detailLink}>{getDaysOpen(incident)}</Link>
                </S.Td>
                <S.Td noWrap>
                  <Link to={detailLink}>
                    {string2date(incident.created_at)} {string2time(incident.created_at)}
                  </Link>
                </S.Td>
                <S.Td>
                  <Link to={detailLink}>
                    {configuration.fetchDistrictsFromBackend
                      ? getListValueByKey(districts, incident.location && incident.location.area_code)
                      : getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}
                  </Link>
                </S.Td>
                <S.Td>
                  <Link to={detailLink}>{incident.category && incident.category.sub}</Link>
                </S.Td>
                <S.Td>
                  <Link to={detailLink}>{getListValueByKey(status, incident.status && incident.status.state)}</Link>
                </S.Td>
                <S.Td>
                  <Link to={detailLink}>
                    {getListValueByKey(priority, incident.priority && incident.priority.priority)}
                  </Link>
                </S.Td>
                <S.Td>
                  <Link to={detailLink}>{incident.location && incident.location.address_text}</Link>
                </S.Td>
                {users && (
                  <S.Td>
                    <Link to={detailLink}>{getAssignedUserName(incident.assigned_user_id)}</Link>
                  </S.Td>
                )}
              </tr>
            );
          })}
        </tbody>
      </S.Table>
    </S.List>
  );
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
