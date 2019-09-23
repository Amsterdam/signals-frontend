/**
*
* IncidentWizard
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';

import LoadingIndicator from 'shared/components/LoadingIndicator';

import IncidentForm from '../IncidentForm';
import IncidentPreview from '../IncidentPreview';
import onNext from './services/on-next';

import './style.scss';

function IncidentWizard({ wizardDefinition, getClassification, updateIncident, createIncident, incidentContainer, isAuthenticated }) {
  return (
    <div className="incident-wizard">
      <Route
        render={({ history }) => (
          <Wizard history={history} onNext={(wiz) => onNext(wizardDefinition, wiz, incidentContainer.incident, isAuthenticated)}>
            {incidentContainer.loading ? <LoadingIndicator /> : ''}
            {!incidentContainer.loading ?
              <Steps>
                {Object.keys(wizardDefinition).map((key) => (
                  <Step
                    key={key}
                    id={`incident/${key}`}
                    render={() => (
                      <div>
                        <h1>{wizardDefinition[key].label || key}</h1>
                        {wizardDefinition[key].preview ?
                          <IncidentPreview
                            incidentContainer={incidentContainer}
                            preview={wizardDefinition[key].preview}
                            isAuthenticated={isAuthenticated}
                          />
                          : ''}

                        {wizardDefinition[key].form || wizardDefinition[key].formFactory ?
                          <IncidentForm
                            fieldConfig={wizardDefinition[key].form || wizardDefinition[key].formFactory(incidentContainer.incident)}
                            incidentContainer={incidentContainer}
                            getClassification={getClassification}
                            updateIncident={updateIncident}
                            createIncident={createIncident}
                            wizard={wizardDefinition}
                            postponeSubmitWhenLoading={wizardDefinition[key].postponeSubmitWhenLoading}
                            isAuthenticated={isAuthenticated}
                          />
                          : ''}
                      </div>
                    )}
                  />
                )
                )}
              </Steps>
            : ''}
          </Wizard>
        )}
      />
    </div>
  );
}

IncidentWizard.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  wizardDefinition: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

export default IncidentWizard;
