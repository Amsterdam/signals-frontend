import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';

import FilterTagList from '../../../FilterTagList';

import './style.scss';

const getId = (filter) => {
  const href = get(filter, '_links.self.href') || '';
  const found = href.match(/\/(\d+)$/);
  return (found && found[1]) || 0;
};

const FilterItem = ({ filter, onRemoveFilter }) => (
  <div className="filter-item">
    <div className="filter-item__name">{filter.name}</div>
    <div className="filter-item__tag-list"><FilterTagList tags={filter.options} /></div>
    <div className="filter-item__actions">
      <button className="filter-item__actions-button" type="button">Toon resultaat</button>
      <button className="filter-item__actions-button" type="button">Wijzig</button>
      <button className="filter-item__actions-button" type="button" onClick={() => onRemoveFilter(getId(filter))}>Verwijder</button>
    </div>
  </div>
);

FilterItem.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    options: PropTypes.shape.isRequired,
  }).isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
};

export default FilterItem;
