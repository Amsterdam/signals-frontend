import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Link } from '@datapunt/asc-ui';

import FilterTagList from '../../../FilterTagList';

import './style.scss';

const StyledHeading = styled(Heading)`
  margin-bottom: 10px;
  color: #fe0000;
`;

const StyledLink = styled(Link)`
  margin-right: 20px;
`;

const FilterItem = ({ filter, onApplyFilter, onRemoveFilter, onClose }) => {
  const handleApplyFilter = (e) => {
    e.preventDefault();

    onApplyFilter(filter);
    onClose();
  };

  const handleEditFilter = (e) => {
    e.preventDefault();

    onApplyFilter(filter);

    // IE11 doesn't support dispatching an event without initialisation
    // @see {@link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events}
    let event;
    if (typeof Event === 'function') {
      event = new Event('openFilter');
    } else {
      event = document.createEvent('Event');
      const bubbles = false;
      const cancelable = false;
      event.initEvent('openFilter', bubbles, cancelable);
    }

    document.dispatchEvent(event);

    onClose();
  };

  const handleRemoveFilter = (e) => {
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
      <StyledHeading $as="h4">{filter.name}</StyledHeading>
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
  filter: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.shape({
      incident_date: PropTypes.string,
      address_text: PropTypes.string,
      stadsdeel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      maincategory_slug: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      priority: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      status: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      category_slug: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
    }).isRequired,
  }).isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
};

export default FilterItem;
