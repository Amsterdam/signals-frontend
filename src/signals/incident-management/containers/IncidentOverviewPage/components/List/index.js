import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as types from 'shared/types';

import Body from '../Body';
import Header from '../Header';
import './style.scss';

const getDaysOpen = incident => {
  const statusesWithoutDaysOpen = ['o', 'a', 's', 'reopen requested'];

  if (
    incident.status &&
    !statusesWithoutDaysOpen.includes(incident.status.state)
  ) {
    const start = moment(incident.created_at.split('T')[0]);
    const duration = moment.duration(moment().diff(start));

    return Math.trunc(duration.asDays());
  }

  return '-';
};

const List = ({
  sort,
  incidents,
  priority,
  status,
  stadsdeel,
  onChangeOrdering,
}) => {
  const onSort = useCallback(
    srt => () => {
      const sortIsAsc = sort && sort.indexOf(sort) === 0;

      onChangeOrdering(sortIsAsc ? `-${srt}` : srt);
    },
    [sort, onChangeOrdering]
  );

  const sortClassName = useCallback(
    sortName => {
      let className = '';
      const currentSort = sort && sort.split(',')[0];

      if (currentSort && currentSort.indexOf(sortName) > -1) {
        className =
          currentSort.charAt(0) === '-' ? 'sort sort-down' : 'sort sort-up';
      }

      return className;
    },
    [sort]
  );

  return (
    <div className="list-component" data-testid="incidentOverviewListComponent">
      <div className="list-component__body">
        <table
          className="list-component__table"
          cellSpacing="0"
          cellPadding="0"
        >
          <Header onSort={onSort} sortClassName={sortClassName} />
          <tbody>
            <Body
              incidents={incidents}
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
  priority: types.dataListType.isRequired,
  status: types.dataListType.isRequired,
  stadsdeel: types.dataListType.isRequired,

  onChangeOrdering: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

export default List;
