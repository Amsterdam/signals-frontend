/**
 *
 * IncidentContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';
import wizardDefinition from '../../definitions/wizard';
import { getClassification, updateIncident, createIncident } from './actions';
import makeSelectIncidentContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import IncidentWizard from '../../components/IncidentWizard';

export class IncidentContainer extends React.Component {
  constructor(props) {
    super(props);

    this.getClassification = this.props.getClassification.bind(this);
    this.updateIncident = this.props.updateIncident.bind(this);
    this.createIncident = this.props.createIncident.bind(this);
  }

  render() {
    return (
      <div className="incident-container">
        <div className="">
          <div className="incident-container__alert">
            <b>*** BELANGRIJK ***</b><br />
              Melding over horeca of evenementen? Vul dan bij de melding altijd uw contactgegevens in, dan kunnen wij u beter en sneller helpen.<br /><br />
              Heeft u een melding over straatverlichting, verkeerslichten en klokken? <a href="https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/scMeldingenovl.aspx">Gebruik tijdelijk dit aparte formulier!</a>
          </div>
          <IncidentWizard
            wizardDefinition={wizardDefinition}
            getClassification={this.getClassification}
            updateIncident={this.updateIncident}
            createIncident={this.createIncident}
            incidentContainer={this.props.incidentContainer}
            isAuthenticated={this.props.isAuthenticated}
          />
        </div>
      </div>
    );
  }
}

IncidentContainer.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  incidentContainer: makeSelectIncidentContainer(),
  isAuthenticated: makeSelectIsAuthenticated()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  getClassification,
  updateIncident,
  createIncident
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentContainer', reducer });
const withSaga = injectSaga({ key: 'incidentContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentContainer);
