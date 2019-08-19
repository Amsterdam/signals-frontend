import React from 'react';
import PropTypes from 'prop-types';

import FilterTagList from '../../../FilterTagList';

import './style.scss';

const FilterItem = ({ filter }) => (
  <div className="filter-item">
    <div className="filter-item__name">{filter.name}</div>
    <div className="filter-item__tag-list"><FilterTagList tags={filter.options} /></div>
  </div>
);

FilterItem.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    options: PropTypes.shape.isRequired,
  }).isRequired,
};

export default FilterItem;
