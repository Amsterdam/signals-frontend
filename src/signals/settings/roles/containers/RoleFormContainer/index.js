import React, { Fragment } from 'react';
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
import {
  makeSelectUserCan,
} from 'containers/App/selectors';

import makeSelectRolesModel from 'models/roles/selectors';
import { patchRole, saveRole } from 'models/roles/actions';
import { ROLES_URL } from 'signals/settings/routes';

import RoleForm from './components/RoleForm';


export const RoleFormContainer = ({
  roles: {
    list,
    permissions,
    loading,
    loadingPermissions,
    responseSuccess,
    responseError,
  },
  onPatchRole,
  onSaveRole,
  userCan,
}) => {
  const { roleId } = useParams();
  const role = list.find(item => item.id === roleId * 1);
  const title = `Rol ${roleId ? 'wijzigen' : 'toevoegen'}`;

  return (
    <Fragment>
      <PageHeader
        title={title}
        BackLink={
          <BackLink to={ROLES_URL}>
            Terug naar overzicht
          </BackLink>
        }
      />
      <Row>
        <Column span={12}>
          {responseSuccess &&
            <FormAlert
              data-testid="roleFormSuccess"
              isNotification
              title="Gegevens opgeslagen"
            />}
          {responseError &&
            <FormAlert
              data-testid="roleFormError"
              title="Er is iets mis gegaan bij het opslaan"
            />}
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
                onSaveRole={onSaveRole}
                readOnly={!userCan('change_group')}
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
  onPatchRole: PropTypes.func.isRequired,
  onSaveRole: PropTypes.func.isRequired,
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
  userCan: makeSelectUserCan,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  onPatchRole: patchRole,
  onSaveRole: saveRole,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RoleFormContainer);
