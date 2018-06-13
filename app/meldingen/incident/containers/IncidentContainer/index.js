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
import { setIncident, createIncident } from './actions';
import makeSelectIncidentContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import './style.scss';

import IncidentWizard from '../../components/IncidentWizard/Loadable';

class IncidentContainer extends React.Component {
  constructor(props) {
    super(props);

    this.setIncident = this.props.setIncident.bind(this);
    this.createIncident = this.props.createIncident.bind(this);
  }

  render() {
    return (
      <div className="incident-container">
        <IncidentWizard
          setIncident={this.setIncident}
          incident={this.props.incidentcontainer.incident}
        />
      </div>
    );
  }
}

IncidentContainer.propTypes = {
  incidentcontainer: PropTypes.object.isRequired,
  setIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentcontainer: makeSelectIncidentContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    setIncident: (incident) => dispatch(setIncident(incident)),
    createIncident: (incident) => dispatch(createIncident(incident))
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
