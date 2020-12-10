import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@amsterdam/asc-ui';

const List = styled.ul`
  border-top: 0;
  padding: 0;
  margin-bottom: 4px;
  margin-top: 0;
`;

const ListItem = styled.li`
  line-height: ${themeSpacing(4)};
  padding: ${themeSpacing(1, 0)};
  display: flex;
  align-items:center;

  &:focus {
    outline-style: none;
  }
`;

const StyledIcon = styled.div`
  margin: 0 ${themeSpacing(2)} 0 0;
  display: inline-block;
  background-image: url(${({ url }) => url}) ;
  background-size: cover;
  width: ${({ size }) => size}px;
  height:${({ size }) => size}px;
`;

const ContainerList = ({ selection }) => (
  <List data-testid="containerList">
    {selection &&
      selection.map(({ id, description, iconUrl }) => (
        <ListItem id={id} data-testid={id} key={id} tabIndex={-1}>
          <React.Fragment>
            <StyledIcon size={40} url={iconUrl}>
            </StyledIcon>
            {`${description} - ${id}`}
          </React.Fragment>
        </ListItem>
      ))}
  </List>
);

ContainerList.propTypes = {
  selection: PropTypes.array,
};

export default ContainerList;
