import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectError, makeSelectErrorMessage } from 'containers/App/selectors';
import { resetGlobalError } from '../App/actions';

// import messages from './messages';
import './style.scss';

export const GlobalError = ({ error, errorMessage, onClose }) => (
  <div>
    {error ?
      <div className="global-error">
        {errorMessage}
        <button
          className="global-error__close-button"
          onClick={onClose}
        >sluit</button>
      </div>
    : ''}
  </div>
);

GlobalError.defaultProps = {
  error: false
};

GlobalError.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  onClose: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  errorMessage: makeSelectErrorMessage()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onClose: resetGlobalError
}, dispatch);
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(GlobalError);
