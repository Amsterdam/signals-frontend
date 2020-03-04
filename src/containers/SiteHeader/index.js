import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectUserCan,
  makeSelectUserCanAccess,
} from 'containers/App/selectors';
import SiteHeader from 'components/SiteHeader';

import { doLogout } from '../App/actions';

export const SiteHeaderContainer = ({ onLogOut, userCan, userCanAccess }) => (
  <SiteHeader
    onLogOut={onLogOut}
    showItems={{
      defaultTexts: userCan('sia_statusmessagetemplate_write'),
      departments: userCanAccess('departments'),
      groups: userCanAccess('groups'),
      settings: userCanAccess('settings'),
      users: userCanAccess('users'),
      categories: userCanAccess('categories'),
    }}
  />
);

SiteHeaderContainer.propTypes = {
  onLogOut: PropTypes.func,
  userCan: PropTypes.func,
  userCanAccess: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userCan: makeSelectUserCan,
  userCanAccess: makeSelectUserCanAccess,
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
