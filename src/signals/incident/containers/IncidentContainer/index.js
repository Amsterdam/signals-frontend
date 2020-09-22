import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';

import { isAuthenticated } from 'shared/services/auth/auth';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { useLocation } from 'react-router-dom';
import wizardDefinition from '../../definitions/wizard';
import { getClassification, updateIncident, createIncident } from './actions';
import { makeSelectIncidentContainer } from './selectors';
import reducer from './reducer';
import saga from './saga';
import IncidentWizard from '../../components/IncidentWizard';
import IncidentClassification from '../../components/IncidentClassification';
import './style.scss';

export const IncidentContainerComponent = ({
  createIncidentAction,
  getClassificationAction,
  incidentContainer,
  updateIncidentAction,
}) => {
  const { pathname } = useLocation();
  const presetClassification = pathname.startsWith('/categorie');

  return (
    <Row>
      <Column span={12}>
        {presetClassification ? (
          <IncidentClassification />
        ) : (
          <IncidentWizard
            wizardDefinition={wizardDefinition}
            getClassification={getClassificationAction}
            updateIncident={updateIncidentAction}
            createIncident={createIncidentAction}
            incidentContainer={incidentContainer}
            isAuthenticated={isAuthenticated()}
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
