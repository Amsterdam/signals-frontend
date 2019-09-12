import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import styled from 'styled-components';

import {
  Heading,
  Link,
 } from '@datapunt/asc-ui';

import FilterTagList from '../../../FilterTagList';

import './style.scss';

const StyledHeading = styled(Heading)`
  margin-bottom: 10px;
  color: #fe0000;
`;

const StyledLink = styled(Link)`
  margin-right: 20px;
`;

const getId = (filter) => {
  const href = get(filter, '_links.self.href') || '';
  const found = href.match(/\/(\d+)$/);
  return (found && found[1]) || 0;
};

const handleApplyFilter = (e, filter, onApplyFilter, onClose) => {
  e.preventDefault();
  onApplyFilter(filter);
  onClose();
};

const handleEditFilter = (e, filter, onApplyFilter, onClose) => {
  e.preventDefault();
  onApplyFilter(filter);
  document.dispatchEvent(new Event('openFilter'));
  onClose();
};

const handleRemoveFilter = (e, id, onRemoveFilter) => {
  e.preventDefault();
  onRemoveFilter(id);
};

const FilterItem = ({ filter, onApplyFilter, onRemoveFilter, onClose }) => (
  <div className="filter-item">
    <StyledHeading $as="h4">{filter.name}</StyledHeading>
    <div className="filter-item__tag-list"><FilterTagList tags={filter.options} /></div>
    <div className="filter-item__actions">

      <StyledLink href="/" variant="inline" onClick={(e) => handleApplyFilter(e, filter, onApplyFilter, onClose)}>
        Toon resultaat
      </StyledLink>
      <StyledLink href="/" variant="inline" onClick={(e) => handleEditFilter(e, filter, onApplyFilter, onClose)}>
        Wijzig
      </StyledLink>
      <StyledLink href="/" variant="inline" onClick={(e) => handleRemoveFilter(e, getId(filter), onRemoveFilter)}>
        Verwijder
      </StyledLink>
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
  onClose: PropTypes.func.isRequired,
};

export default FilterItem;
