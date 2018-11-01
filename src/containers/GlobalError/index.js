import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectError, makeSelectErrorMessage } from 'containers/App/selectors';
import { resetGlobalError } from '../App/actions';
import getMessage from './services/get-message';

import './style.scss';

export const GlobalError = ({ error, errorMessage, onClose }) => (
  <div>
    {error ?
      <div className="global-error container">
        <div className="row">
          <div className="col col-12">
            <div className="global-error__message">
              <button
                className="global-error__close-button"
                onClick={onClose}
              />
              {getMessage(errorMessage)}
            </div>
          </div>
        </div>
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
