import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem } from '@datapunt/asc-ui';

const StyledList = styled(List)`
  margin-bottom: 0;
`;

const ListObjectValue = ({ value }) =>
  Array.isArray(value) &&
  value.length > 0 && (
    <StyledList>
      {value
        .filter(({ label }) => Boolean(label))
        .map(item => (
          <ListItem key={item.label}>{item.label}</ListItem>
        ))}
    </StyledList>
  );

ListObjectValue.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ListObjectValue;
