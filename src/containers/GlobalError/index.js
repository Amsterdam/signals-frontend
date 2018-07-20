import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectError, makeSelectErrorMessage } from 'containers/App/selectors';

// import messages from './messages';
import './style.scss';

const GlobalError = ({ error, errorMessage }) => (
  <div>
    {error ?
      <div className="global-error">
        {errorMessage}
      </div>
    : ''}
  </div>
);

GlobalError.propTypes = {
  error: PropTypes.boolean,
  errorMessage: PropTypes.string
};

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  errorMessage: makeSelectErrorMessage()
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(GlobalError);
