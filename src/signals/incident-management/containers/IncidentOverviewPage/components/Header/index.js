import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Header = ({ onSort, sortClassName }) => (
  <thead>
    <tr>
      <th onClick={onSort('id')} className={sortClassName('id')}>
        Id
      </th>
      <th onClick={onSort('days_open')} className={sortClassName('days_open')}>
        Dag
      </th>
      <th
        onClick={onSort('created_at')}
        className={sortClassName('created_at')}
      >
        Datum en tijd
      </th>
      <th
        onClick={onSort('stadsdeel,-created_at')}
        className={sortClassName('stadsdeel')}
      >
        Stadsdeel
      </th>
      <th
        onClick={onSort('sub_category,-created_at')}
        className={sortClassName('sub_category')}
      >
        Subcategorie
      </th>
      <th
        onClick={onSort('status,-created_at')}
        className={sortClassName('status')}
      >
        Status
      </th>
      <th
        onClick={onSort('priority,-created_at')}
        className={sortClassName('priority')}
      >
        Urgentie
      </th>
      <th
        onClick={onSort('address,-created_at')}
        className={sortClassName('address')}
      >
        Adres
      </th>
    </tr>
  </thead>
);

Header.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortClassName: PropTypes.func.isRequired,
};

export default memo(Header);
