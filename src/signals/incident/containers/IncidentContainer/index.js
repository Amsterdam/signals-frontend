/**
 *
 * IncidentContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';
import { getClassification, setIncident, createIncident } from './actions';
import makeSelectIncidentContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import IncidentWizard from '../../components/IncidentWizard';

class IncidentContainer extends React.Component {
  constructor(props) {
    super(props);

    this.getClassification = this.props.getClassification.bind(this);
    this.setIncident = this.props.setIncident.bind(this);
    this.createIncident = this.props.createIncident.bind(this);
  }

  render() {
    return (
      <div className="incident-container">
        <IncidentWizard
          getClassification={this.getClassification}
          setIncident={this.setIncident}
          createIncident={this.createIncident}
          incidentContainer={this.props.incidentContainer}
          isAuthenticated={this.props.isAuthenticated}
        />
      </div>
    );
  }
}

IncidentContainer.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  incidentContainer: makeSelectIncidentContainer(),
  isAuthenticated: makeSelectIsAuthenticated()
});

function mapDispatchToProps(dispatch) {
  return {
    getClassification: (text) => dispatch(getClassification(text)),
    setIncident: (incident) => dispatch(setIncident(incident)),
    createIncident: (incident, wizard) => dispatch(createIncident(incident, wizard))
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
