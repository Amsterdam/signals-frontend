import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import routes from 'signals/settings/routes';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import { showGlobalNotification as showGlobalNotificationAction } from 'containers/App/actions';
import {
  VARIANT_SUCCESS,
  TYPE_LOCAL,
} from 'containers/Notification/constants';
import {
  makeSelectUserCan,
} from 'containers/App/selectors';

import { rolesModelSelector } from 'models/roles/selectors';
import { patchRole, saveRole, resetResponse } from 'models/roles/actions';

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
  showGlobalNotification,
  onResetResponse,
  userCan,
}) => {
  const { roleId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const role = list.find(item => item.id === roleId * 1);
  const title = `Rol ${roleId ? 'wijzigen' : 'toevoegen'}`;
  const redirectURL = location.referrer || routes.roles;

  useEffect(() => {
    let message;

    if (responseSuccess) {
      message = roleId ? 'Gegevens opgeslagen' : 'Rol toegevoegd';
    }

;
    onResetResponse();

    if (!message) return;

    showGlobalNotification({
      variant: VARIANT_SUCCESS,
      title: message,
      type: TYPE_LOCAL,
    });

    if (responseSuccess) {
      history.push(redirectURL);
    }
  }, [
    history,
    onResetResponse,
    redirectURL,
    responseError,
    responseSuccess,
    roleId,
    showGlobalNotification,
  ]);

  return (
    <Fragment>
      <PageHeader
        title={title}
        BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
      />
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
  showGlobalNotification: PropTypes.func.isRequired,
  onPatchRole: PropTypes.func.isRequired,
  onSaveRole: PropTypes.func.isRequired,
  onResetResponse: PropTypes.func.isRequired,
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: rolesModelSelector,
  userCan: makeSelectUserCan,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  showGlobalNotification: showGlobalNotificationAction,
  onResetResponse: resetResponse,
  onPatchRole: patchRole,
  onSaveRole: saveRole,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RoleFormContainer);
