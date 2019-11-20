import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles } from 'models/roles/actions';

import RolesList from '../../components/RolesList';

export const RolesOverview = ({
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
    <Fragment>
      <Row>
        <Column span={12}>
          <RolesList
            list={list}
            loading={loading}
          />
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
