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
import { Row, Column } from '@datapunt/asc-ui';

import { isAuthenticated } from 'shared/services/auth/auth';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import wizardDefinition from '../../definitions/wizard';
import { getClassification, updateIncident, createIncident } from './actions';
import { makeSelectIncidentContainer } from './selectors';
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
      <Row>
        <div style={{ color: 'white', backgroundColor: 'red', marginTop: '1em', padding: '1em' }}>
          We pakken op dit moment alleen urgente meldingen op. De afhandeling van
          uw melding kan daarom tijdelijk langer duren dan de standaard
          afhandeltermijn die wordt vermeld in de bevestiging die u ontvangt na
          registratie van uw melding. Dank voor uw begrip.
        </div>

        <br />

        <Column span={12}>
          <IncidentWizard
            wizardDefinition={wizardDefinition}
            getClassification={this.getClassification}
            updateIncident={this.updateIncident}
            createIncident={this.createIncident}
            incidentContainer={this.props.incidentContainer}
            isAuthenticated={isAuthenticated()}
          />
        </Column>
      </Row>
    );
  }
}

IncidentContainer.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentContainer: makeSelectIncidentContainer,
});

export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getClassification,
    updateIncident,
    createIncident,
  },
  dispatch,
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'incidentContainer', reducer });
const withSaga = injectSaga({ key: 'incidentContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentContainer);
