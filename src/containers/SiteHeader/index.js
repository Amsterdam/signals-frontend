import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectUserCan, makeSelectUserCanAccess } from 'containers/App/selectors';
import SiteHeader from 'components/SiteHeader';

import { doLogout } from '../App/actions';

export const SiteHeaderContainer = () => {
  const userCan = useSelector(makeSelectUserCan);
  const userCanAccess = useSelector(makeSelectUserCanAccess);
  const dispatch = useDispatch();
  return (
    <SiteHeader
      onLogOut={() => dispatch(doLogout)}
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
};

export default SiteHeaderContainer;
