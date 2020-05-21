import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as types from 'shared/types';

import Body from '../Body';
import Header from '../Header';
import './style.scss';

const getDaysOpen = incident => {
  const statusesWithoutDaysOpen = ['o', 'a', 's', 'reopen requested'];

  if (incident.status && !statusesWithoutDaysOpen.includes(incident.status.state)) {
    const start = moment(incident.created_at.split('T')[0]);
    const duration = moment.duration(moment().diff(start));

    return Math.trunc(duration.asDays());
  }

  return '-';
};

const TableBody = styled(Body)`
  ${({ isLoading }) =>
    isLoading &&
    css`
      filter: blur(4px);
    `}
`;

const List = ({ sort, incidents, isLoading, priority, status, stadsdeel, onChangeOrdering }) => {
  const onSort = useCallback(
    str => () => {
      const sortIsAsc = sort && sort.indexOf(str) === 0;

      onChangeOrdering(sortIsAsc ? `-${str}` : str);
    },
    [sort, onChangeOrdering]
  );

  const sortClassName = useCallback(
    sortName => {
      const currentSort = sort && sort.split(',')[0];

      if (currentSort && currentSort.indexOf(sortName) > -1) {
        return currentSort.charAt(0) === '-' ? 'sort sort-down' : 'sort sort-up';
      }

      return '';
    },
    [sort]
  );

  return (
    <div className="list-component" data-testid="incidentOverviewListComponent">
      <div className="list-component__body">
        <table className="list-component__table" cellSpacing="0" cellPadding="0">
          <Header onSort={onSort} sortClassName={sortClassName} />
          <tbody>
            <TableBody
              incidents={incidents}
              isLoading={isLoading}
              priority={priority}
              status={status}
              stadsdeel={stadsdeel}
              getDaysOpen={getDaysOpen}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

List.propTypes = {
  incidents: PropTypes.arrayOf(types.incidentType).isRequired,
  isLoading: PropTypes.bool,
  priority: types.dataListType.isRequired,
  status: types.dataListType.isRequired,
  stadsdeel: types.dataListType.isRequired,

  onChangeOrdering: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

export default List;
