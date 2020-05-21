import React from 'react';
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
      <th onClick={onSort('created_at')} className={sortClassName('created_at')}>
        Datum en tijd
      </th>
      <th onClick={onSort('stadsdeel')} className={sortClassName('stadsdeel')}>
        Stadsdeel
      </th>
      <th onClick={onSort('sub_category')} className={sortClassName('sub_category')}>
        Subcategorie
      </th>
      <th onClick={onSort('status')} className={sortClassName('status')}>
        Status
      </th>
      <th onClick={onSort('priority')} className={sortClassName('priority')}>
        Urgentie
      </th>
      <th onClick={onSort('address')} className={sortClassName('address')}>
        Adres
      </th>
    </tr>
  </thead>
);

Header.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortClassName: PropTypes.func.isRequired,
};

export default Header;
