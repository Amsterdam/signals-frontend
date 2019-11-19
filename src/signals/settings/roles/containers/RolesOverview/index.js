import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles, fetchPermissions } from 'models/roles/actions';

import RolesList from '../../components/RolesList';
import RolesForm from '../../components/RolesForm';

export const RolesOverview = ({
  roles: {
    list,
    loading,
    loadingPermissions,
  },
  id,
  onFetchRoles,
  onFetchPermissions,
}) => {
  useEffect(() => {
    onFetchRoles();
    onFetchPermissions();
  }, []);

  return (
    <div>
      <Row>
        <Column span={12}>
          {id ?
            <RolesForm
              id={id}
              loading={loading || loadingPermissions}
            />
            :
            <RolesList
              list={list}
              loading={loading || loadingPermissions}
            />
          }
        </Column>
      </Row>
    </div >
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
    list: PropTypes.array,
    permissions: PropTypes.array,
    loading: PropTypes.bool,
    loadingPermissions: PropTypes.bool,
  }),
  id: PropTypes.string,
  onFetchRoles: PropTypes.func.isRequired,
  onFetchPermissions: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRoles: fetchRoles,
  onFetchPermissions: fetchPermissions,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RolesOverview);
