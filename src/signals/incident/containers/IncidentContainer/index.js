import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, themeColor, themeSpacing } from '@datapunt/asc-ui';

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

const Alert = styled.div`
  color: white;
  background-color: ${themeColor('secondary')};
  margin-top: ${themeSpacing(5)};
  padding: ${themeSpacing(4)};
`;

export const IncidentContainerComponent = ({
  createIncidentAction,
  getClassificationAction,
  incidentContainer,
  updateIncidentAction,
}) => (
  <Row>
    <Alert data-testid="alertMessage">
      We pakken op dit moment alleen urgente meldingen op. De afhandeling van uw melding kan daarom tijdelijk langer
      duren dan de standaard afhandeltermijn die in de bevestigingsmail van uw melding staat. Wij hopen op uw begrip.
    </Alert>

    <br />

    <Column span={12}>
      <IncidentWizard
        wizardDefinition={wizardDefinition}
        getClassification={getClassificationAction}
        updateIncident={updateIncidentAction}
        createIncident={createIncidentAction}
        incidentContainer={incidentContainer}
        isAuthenticated={isAuthenticated()}
      />
    </Column>
  </Row>
);

IncidentContainerComponent.propTypes = {
  createIncidentAction: PropTypes.func.isRequired,
  getClassificationAction: PropTypes.func.isRequired,
  incidentContainer: PropTypes.object.isRequired,
  updateIncidentAction: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentContainer: makeSelectIncidentContainer,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createIncidentAction: createIncident,
      getClassificationAction: getClassification,
      updateIncidentAction: updateIncident,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentContainer', reducer });
const withSaga = injectSaga({ key: 'incidentContainer', saga });

export default compose(withReducer, withSaga, withConnect)(IncidentContainerComponent);
