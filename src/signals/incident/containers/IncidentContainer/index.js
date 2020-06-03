import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, themeColor, themeSpacing } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
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
}) => {
  const [definition, setDefinition] = useState();

  useEffect(() => {
    const loadDefinition = async () => {
      import(
        /* webpackChunkName: "wizardDefinition", webpackMode: "lazy" */ '../../definitions/wizard'
      ).then(wizardDefinition => setDefinition(wizardDefinition.default));
    };

    loadDefinition();
  }, []);

  return (
    <Row>
      <Alert data-testid="alertMessage">
        We pakken op dit moment alleen urgente meldingen op. De afhandeling van uw melding kan daarom tijdelijk langer
        duren dan de standaard afhandeltermijn die in de bevestigingsmail van uw melding staat. Wij hopen op uw begrip.
      </Alert>

      <br />

      <Column span={12}>
        {!definition ? (
          <LoadingIndicator />
        ) : (
          <IncidentWizard
            wizardDefinition={definition}
            getClassification={getClassificationAction}
            updateIncident={updateIncidentAction}
            createIncident={createIncidentAction}
            incidentContainer={incidentContainer}
          />
        )}
      </Column>
    </Row>
  );
};

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
