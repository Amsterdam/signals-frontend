import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Link } from '@datapunt/asc-ui';
import * as types from 'shared/types';
import { parseToAPIData } from 'signals/shared/filter/parse';

import Refresh from '../../../../../../shared/images/icon-refresh.svg';
import FilterTagList from '../../../FilterTagList';

import './style.scss';

const StyledH4 = styled(Heading)`
  margin-bottom: 8px;
  color: #fe0000;
  display: block;
`;

const StyledLink = styled(Link)`
  margin-right: 20px;
`;

const RefreshIcon = styled(Refresh).attrs({
  color: '#ff0000',
  height: 18,
})`
  margin-right: 10px;
  vertical-align: middle;
  margin-top: -2px;
  cursor: default;
`;

const FilterItem = ({ filter, onApplyFilter, onEditFilter, onRemoveFilter, onClose }) => {
  const handleApplyFilter = e => {
    e.preventDefault();

    onApplyFilter(parseToAPIData(filter));

    onClose();
  };

  const handleEditFilter = e => {
    e.preventDefault();

    onEditFilter(parseToAPIData(filter));

    onClose();
  };

  const handleRemoveFilter = e => {
    e.preventDefault();

    if (
      global.confirm(
        'Weet je zeker dat je dit filter wilt verwijderen?\nDit kan niet ongedaan worden gemaakt.',
      )
    ) {
      onRemoveFilter(filter.id);
    }
  };

  return (
    <div className="filter-item">
      <StyledH4 forwardedAs="h4">
        {filter.refresh && (<RefreshIcon />)}
        {filter.name}
      </StyledH4>

      <div className="filter-item__tag-list">
        <FilterTagList tags={filter.options} />
      </div>
      <div className="filter-item__actions">
        <StyledLink
          href="/"
          variant="inline"
          onClick={handleApplyFilter}
          data-testid="handleApplyFilterButton"
        >
          Toon resultaat
        </StyledLink>
        <StyledLink
          href="/"
          variant="inline"
          onClick={handleEditFilter}
          data-testid="handleEditFilterButton"
        >
          Wijzig
        </StyledLink>
        <StyledLink
          href="/"
          variant="inline"
          onClick={handleRemoveFilter}
          data-testid="handleRemoveFilterButton"
        >
          Verwijder
        </StyledLink>
      </div>
    </div>
  );
};

FilterItem.propTypes = {
  filter: types.filterType.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditFilter: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
};

export default FilterItem;
