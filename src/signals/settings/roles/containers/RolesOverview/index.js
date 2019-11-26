import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles, fetchPermissions, patchRole } from 'models/roles/actions';

import RolesList from '../../components/RolesList';
import RolesForm from '../../components/RolesForm';

export const RolesOverview = ({
  roles: {
    list,
    permissions,
    loading,
    loadingPermissions,
  },
  id,
  onFetchRoles,
  onFetchPermissions,
  onPatchRole,
}) => {
  useEffect(() => {
    onFetchRoles();
    onFetchPermissions();
  }, []);

  const isLoading = loading || loadingPermissions;

  return (
    <Fragment>
      <Row>
        <Column span={12}>
          {isLoading && <LoadingIndicator />}

          {!isLoading && (
            id ? (
              <RolesForm
                id={id}
                list={list}
                permissions={permissions}
                onPatchRole={onPatchRole}
              />
            ) : (
              <RolesList list={list} />
            )
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

RolesOverview.defaultProps = {
  roles: {
    list: [],
    loading: false,
  },
};

RolesOverview.propTypes = {
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
  id: PropTypes.string,

  onFetchRoles: PropTypes.func.isRequired,
  onFetchPermissions: PropTypes.func.isRequired,
  onPatchRole: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRoles: fetchRoles,
  onFetchPermissions: fetchPermissions,
  onPatchRole: patchRole,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RolesOverview);
