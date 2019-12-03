import React from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import { useHistory } from 'react-router-dom';

import ListComponent from 'components/List';

import formatRoles from '../../services/formatRoles';

const StyledListComponent = styled(ListComponent)`
  th:nth-child(1),
  td:nth-child(1) {
    width: 20%;
  }
`;

export const RolesList = ({
  list,
}) => {
  const history = useHistory();

  const onItemClick = e => {
    const roleId = e.currentTarget.getAttribute('data-item-id');
    /* istanbul ignore else */
    if (roleId > -1) {
      history.push(`/instellingen/rol/${roleId}`);
    }
  };

  return (
    <div data-testid="rolesList">
      <StyledListComponent
        items={formatRoles(list)}
        invisibleColumns={['id']}
        primaryKeyColumn="id"
        onItemClick={onItemClick}
      />
    </div>
  )
};

RolesList.defaultProps = {
  list: [],
};

RolesList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default RolesList;
