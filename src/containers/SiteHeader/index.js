import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectUserPermissions } from 'containers/App/selectors';
import SiteHeader from 'components/SiteHeader';

import { doLogout } from '../App/actions';

export const SiteHeaderContainer = ({ onLogOut, permissions }) => (
  <SiteHeader onLogOut={onLogOut} permissions={permissions} />
);

SiteHeaderContainer.propTypes = {
  onLogOut: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = createStructuredSelector({
  permissions: makeSelectUserPermissions(),
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onLogOut: doLogout,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SiteHeaderContainer);
