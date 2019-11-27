import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import FormAlert from 'components/FormAlert';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles, fetchPermissions, patchRole } from 'models/roles/actions';

import RoleForm from '../../components/RoleForm';

export const RoleFormContainer = ({
  roles: {
    list,
    permissions,
    loading,
    loadingPermissions,
    responseSuccess,
    responseError,
  },
  onFetchRoles,
  onFetchPermissions,
  onPatchRole,
}) => {
  useEffect(() => {
    onFetchRoles();
    onFetchPermissions();
  }, []);

  const { roleId } = useParams();
  const role = list.find(item => item.id === roleId * 1);

  return (
    <Fragment>
      <PageHeader
        title="Gebruiker instellingen"
        BackLink={
          <BackLink to="/instellingen/rollen">
            Terug naar overzicht
          </BackLink>
        }
      />
      <Row>
        <Column span={12}>
          {responseSuccess && <FormAlert isNotification title="Gegevens opgeslagen" />}
          {responseError && <FormAlert title="Het opslaan is fout gegaan" />}
        </Column>
      </Row>
      <Row>
        <Column span={12}>
          {loading || loadingPermissions ?
            <LoadingIndicator />
            :
            (
              <RoleForm
                role={role}
                permissions={permissions}
                onPatchRole={onPatchRole}
              />
            )
          }
        </Column>
      </Row>
    </Fragment>
  );
};

RoleFormContainer.defaultProps = {
  roles: {
    list: [],
    loading: false,
  },
};

RoleFormContainer.propTypes = {
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
    responseSuccess: PropTypes.bool,
    responseError: PropTypes.bool,
  }),

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

export default withConnect(RoleFormContainer);
