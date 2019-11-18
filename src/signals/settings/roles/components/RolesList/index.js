import React from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';

import PageHeader from 'signals/settings/components/PageHeader';
import formatRoles from '../../services/formatRoles';

const StyledListComponent = styled(ListComponent)`
  tr:nth-child(1),
  td:nth-child(1) {
    width: 20%;
  }
`;

export const RolesList = ({
  list,
  loading,
}) => (
  <div>
    <PageHeader title="Rollen" />

    {loading ? (
      <LoadingIndicator />
    ) : (
      <StyledListComponent
        items={formatRoles(list)}
        invisibleColumns={['id']}
        primaryKeyColumn="id"
      />
    )}
  </div >
);

RolesList.defaultProps = {
  list: [],
  loading: false,
};

RolesList.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
};

export default RolesList;
