import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';
import styled from '@datapunt/asc-core';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles } from 'models/roles/actions';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';

import PageHeader from 'signals/settings/components/PageHeader';

const StyledListComponent = styled(ListComponent)`
  tr, td {
    width: 50%;
  }
`;

const formatRoles = items => {
  const roles = [];
  items.forEach(role => {
    let permissions = '';

    role.permissions.forEach(permission => {
      permissions = `${permissions + permission._display} `;
    });

    roles.push({
      id: role.id,
      Naam: role._display,
      Rechten: permissions,
    });
  });

  return roles;
};

const RolesOverview = ({
  roles: {
    list,
    loading,
  },
  onFetchRoles,
}) => {
  useEffect(() => {
    onFetchRoles();
  }, []);

  return (
    <div>
      <PageHeader title="Rollen" />

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <StyledListComponent
                items={formatRoles(list)}
                invisibleColumns={['id']}
                primaryKeyColumn="id"
                columnOrder={['Naam', 'Rechten']}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

RolesOverview.defaultProps = {
  roles: {
    list: [],
    loading: true,
  },
};

RolesOverview.propTypes = {
  roles: PropTypes.shape({
    list: PropTypes.array,
    loading: PropTypes.bool,
  }),
  onFetchRoles: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRoles: fetchRoles,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RolesOverview);
