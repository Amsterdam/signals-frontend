import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column, Button } from '@datapunt/asc-ui';
import styled from 'styled-components';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import PageHeader from 'signals/settings/components/PageHeader';

import { makeSelectUserCan } from 'containers/App/selectors';
import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles, resetResponse } from 'models/roles/actions';
import { ROLE_URL } from 'signals/settings/routes';

import RolesList from './components/RolesList';

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`;

export const RolesListContainer = ({
  roles: { list, loading, loadingPermissions },
  onFetchRoles,
  onResetResponse,
  userCan,
}) => {
  useEffect(() => {
    onFetchRoles();
    onResetResponse();
  }, [onFetchRoles, onResetResponse]);

  return (
    <Fragment>
      <PageHeader title="Rollen">
        {userCan('add_group') && (
          <HeaderButton variant="primary" $as={Link} to={ROLE_URL}>
            Rol toevoegen
          </HeaderButton>
        )}
      </PageHeader>
      <Row>
        <Column span={12}>
          {loading || loadingPermissions ? (
            <LoadingIndicator />
          ) : (
            <RolesList
              list={list}
              linksEnabled={Boolean(userCan('view_group') || userCan('change_group'))}
            />
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

RolesListContainer.defaultProps = {
  roles: {
    list: [],
    loading: false,
  },
};

RolesListContainer.propTypes = {
  roles: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    loading: PropTypes.bool,
    loadingPermissions: PropTypes.bool,
  }),

  onFetchRoles: PropTypes.func.isRequired,
  onResetResponse: PropTypes.func.isRequired,
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
  userCan: makeSelectUserCan,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onFetchRoles: fetchRoles,
      onResetResponse: resetResponse,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RolesListContainer);
