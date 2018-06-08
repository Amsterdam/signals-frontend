/**
 *
 * IncidentContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import './style.scss';

import IncidentWizard from '../../components/IncidentWizard/Loadable';

export class IncidentContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="incident-container">
        <IncidentWizard />
      </div>
    );
  }
}

IncidentContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentcontainer: makeSelectIncidentContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentContainer', reducer });
const withSaga = injectSaga({ key: 'incidentContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentContainer);
