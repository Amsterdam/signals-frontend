import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import PageHeader from 'signals/settings/components/PageHeader';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles, resetResponse } from 'models/roles/actions';

import RolesList from '../../components/RolesList';

export const RolesListContainer = ({
  roles: {
    list,
    loading,
    loadingPermissions,
  },
  onFetchRoles,
  onResetResponse,
}) => {
  useEffect(() => {
    onFetchRoles();
    onResetResponse();
  }, [onFetchRoles, onResetResponse]);

  return (
    <Fragment>
      <PageHeader title="Rollen" />
      <Row>
        <Column span={12}>
          {loading || loadingPermissions ? <LoadingIndicator /> : <RolesList list={list} />}
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
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRoles: fetchRoles,
  onResetResponse: resetResponse,

}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RolesListContainer);
