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

const handleApplyFilter = (filter, onApplyFilter, onRequestIncidents, onClose) => {
  onApplyFilter(getId(filter));
  onRequestIncidents({ filter });
  onClose();
};

const handleEditFilter = (filter, onApplyFilter, onRequestIncidents, onClose) => {
  onApplyFilter(getId(filter));
  onRequestIncidents({ filter });
  document.dispatchEvent(new Event('openFilter'));
  onClose();
};

// terugzetten tags={filter.options}

const FilterItem = ({ filter, onApplyFilter, onRemoveFilter, onClose, onRequestIncidents }) => (
  <div className="filter-item">
    <div className="filter-item__name">{filter.name}</div>
    <div className="filter-item__tag-list"><FilterTagList tags={filter.options} /></div>
    <div className="filter-item__actions">
      <button className="filter-item__actions-button" type="button" onClick={() => handleApplyFilter(filter, onApplyFilter, onRequestIncidents, onClose)}>Toon resultaat</button>
      <button className="filter-item__actions-button" type="button" onClick={() => handleEditFilter(filter, onApplyFilter, onRequestIncidents, onClose)}>Wijzig</button>
      <button className="filter-item__actions-button" type="button" onClick={() => onRemoveFilter(getId(filter))}>Verwijder</button>
    </div>
  </div>
);

FilterItem.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    options: PropTypes.shape.isRequired,
  }).isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterItem;
