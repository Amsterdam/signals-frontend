import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import PageHeader from 'components/PageHeader';
import { makeSelectPageTitle } from './selectors';

export const PageHeaderContainerComponent = (props) => (
  <PageHeader {...props} />
);

PageHeaderContainerComponent.propTypes = {
  title: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  title: makeSelectPageTitle,
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(PageHeaderContainerComponent);
