import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Row, Column, Button } from '@datapunt/asc-ui';
import styled from 'styled-components';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import PageHeader from 'signals/settings/components/PageHeader';

import { makeSelectUserCan } from 'containers/App/selectors';
import { rolesModelSelector } from 'models/roles/selectors';
import { ROLE_URL } from 'signals/settings/routes';

import RolesList from './components/RolesList';

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`;

export const RolesListContainer = ({
  roles: { list, loading, loadingPermissions },
  userCan,
}) => (
  <Fragment>
    <PageHeader title="Rollen">
      {userCan('add_group') && (
        <HeaderButton variant="primary" forwardedAs={Link} to={ROLE_URL}>
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
            linksEnabled={Boolean(
              userCan('change_group')
            )}
          />
        )}
      </Column>
    </Row>
  </Fragment>
);

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
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: rolesModelSelector,
  userCan: makeSelectUserCan,
});

const withConnect = connect(mapStateToProps);

export default withConnect(RolesListContainer);
