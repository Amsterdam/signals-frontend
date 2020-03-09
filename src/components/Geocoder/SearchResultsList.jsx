import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@datapunt/asc-ui';
import styled from '@datapunt/asc-core';
import SearchResultsListStyle from './SearchResultsListStyle';

const StyledLink = styled(Link)`
  font-weight: ${({ active }) => (active ? 700 : 400)};

  &:hover {
    font-weight: 700;
    cursor: pointer;
  }
`;

const SearchResultsListItem = ({ id, name, selected, index, onSelect }) => (
  <li>
    <StyledLink
      id={id}
      active={index === selected}
      variant="blank"
      onClick={() => onSelect(index)}
    >
      {name}
    </StyledLink>
  </li>
);

SearchResultsListItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  selected: PropTypes.number,
  index: PropTypes.number,
  onSelect: PropTypes.func,
};

const SearchResultsList = ({ items, selected, onSelect }) => {
  const handleSelectedLink = useCallback(
    index => {
      onSelect(index);
    },
    [onSelect]
  );

  return (
    items && (
      <SearchResultsListStyle>
        <ul>
          {items &&
            items.map(({ id, name }, index) => (
              <SearchResultsListItem
                key={id}
                id={id}
                name={name}
                index={index}
                selected={selected}
                onSelect={handleSelectedLink}
              />
            ))}
        </ul>
      </SearchResultsListStyle>
    )
  );
};

SearchResultsList.propTypes = {
  items: PropTypes.array,
  selected: PropTypes.number,
  onSelect: PropTypes.func,
};

export default SearchResultsList;
