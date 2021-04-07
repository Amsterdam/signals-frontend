// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React, { useCallback, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { ChevronUp, ChevronDown, Play } from '@amsterdam/asc-assets';
import { Icon, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import styled from 'styled-components';

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

const StyledList = styled.div`
  width: 100%;
  overflow: auto;

  ${({ isLoading }) => isLoading && 'opacity: 0.3;'}
`;

const Table = styled.table`
  border-collapse: separate;
  width: 100%;
  height: 100%;

  tr:hover td,
  td {
    box-shadow: unset;
  }
`;

const Th = styled.th`
  cursor: pointer;
  font-weight: normal;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  ${props =>
    // Keep Amsterdam's 'Stadsdeel' column at a min-width of 120px to make sure that 'Nieuw-West'
    // doesn't wrap (but 'Het Amsterdamse Bos' is allowed to wrap)
    props['data-testid'] === 'sortStadsdeel' && 'min-width: 120px;'}
`;

const TdStyle = styled.td`
  ${({ noWrap }) => noWrap && 'white-space: nowrap;'}
  padding: 0;

  span {
    display: flex;
    box-sizing: content-box;

    a {
      text-decoration: none;
      color: black;
      display: block;
      width: 100%;
      height: 100%;
      padding: ${themeSpacing(2)};
    }
  }
`;

const Td = ({ detailLink, children, ...rest }) => (
  <TdStyle {...rest}>
    <span>
      <Link to={detailLink}>{children}</Link>
    </span>
  </TdStyle>
);

Td.propTypes = {
  detailLink: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const ParentIconStyle = styled.span`
  & span:nth-child(2) {
    margin-left: -5px; // specific value. Ensures the parent icon composition icons are near each other.
  }
`;

const StyledIcon = styled(Icon)`
  & svg {
    fill: ${themeColor('tint', 'level4')};
  }
`;

const ParentIcon = () => (
  <ParentIconStyle role="img" aria-label="Hoofdmelding">
    <Icon size={14}>
      <Play />
    </Icon>
    <Icon size={14}>
      <Play />
    </Icon>
  </ParentIconStyle>
);

const ChildIcon = () => (
  <StyledIcon size={14} role="img" aria-label="Deelmelding">
    <Play />
  </StyledIcon>
);

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
    <StyledList isLoading={isLoading} className={className} data-testid="incidentOverviewListComponent">
      <Table cellSpacing="0">
        <thead>
          <tr>
            <Th data-testid="parent"></Th>
            <Th data-testid="sortId" onClick={onSort('id')}>
              Id {renderChevron('id')}
            </Th>
            <Th data-testid="sortDaysOpen" onClick={onSort('days_open')}>
              Dag {renderChevron('days_open')}
            </Th>
            <Th data-testid="sortCreatedAt" onClick={onSort('created_at')}>
              Datum en tijd {renderChevron('created_at')}
            </Th>
            {configuration.featureFlags.fetchDistrictsFromBackend ? (
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
            {configuration.featureFlags.assignSignalToEmployee && (
              <Th data-testid="sortAssigedUserEmail" onClick={onSort('assigned_user_email,-created_at')}>
                Toegewezen aan {renderChevron('assigned_user_email')}
              </Th>
            )}
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => {
            const detailLink = `/manage/incident/${incident.id}`;
            return (
              <tr key={incident.id}>
                <Td detailLink={detailLink}>
                  {incident.has_children && <ParentIcon />}
                  {incident.has_parent && <ChildIcon />}
                </Td>
                <Td detailLink={detailLink}>{incident.id}</Td>
                <Td detailLink={detailLink} data-testid="incidentDaysOpen">
                  {getDaysOpen(incident)}
                </Td>
                <Td detailLink={detailLink} noWrap>
                  {string2date(incident.created_at)} {string2time(incident.created_at)}
                </Td>
                <Td detailLink={detailLink}>
                  {configuration.featureFlags.fetchDistrictsFromBackend
                    ? getListValueByKey(districts, incident.location && incident.location.area_code)
                    : getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}
                </Td>
                <Td detailLink={detailLink}>{incident.category && incident.category.sub}</Td>
                <Td detailLink={detailLink}>{getListValueByKey(status, incident.status && incident.status.state)}</Td>
                <Td detailLink={detailLink}>
                  {getListValueByKey(priority, incident.priority && incident.priority.priority)}
                </Td>
                <Td detailLink={detailLink}>{incident.location && incident.location.address_text}</Td>
                {configuration.featureFlags.assignSignalToEmployee && (
                  <Td detailLink={detailLink}>{incident.assigned_user_email}</Td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </StyledList>
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
