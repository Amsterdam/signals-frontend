/**
*
* IncidentWizard
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import wizardDefinition from '../../definitions/wizard';

import IncidentForm from '../IncidentForm';
import IncidentPreview from '../IncidentPreview';
import './style.scss';

function onNext({ step, steps, push }, incident) {
  const wizardStep = step.id && step.id.split('/').reverse()[0];
  const nextStep = wizardStep && wizardDefinition[wizardStep] && wizardDefinition[wizardStep].getNextStep && wizardDefinition[wizardStep].getNextStep(wizardDefinition, incident);
  if (nextStep) {
    push(nextStep);
  } else if (steps.length > 0) {
    push();
  }
}

function IncidentWizard({ getClassification, setIncident, createIncident, incidentContainer, isAuthenticated }) {
  return (
    <div className="incident-wizard">
      <Route
        render={({ history }) => (
          <Wizard history={history} onNext={(wiz) => onNext(wiz, incidentContainer)}>
            {incidentContainer.loading ? <LoadingIndicator /> : ''}
            {!incidentContainer.loading ?
              <Steps>
                {Object.keys(wizardDefinition).map((key) => (
                  <Step key={key} id={`incident/${key}`}>
                    <h2>{wizardDefinition[key].label || key}</h2>
                    {wizardDefinition[key].preview ?
                      <IncidentPreview
                        incidentContainer={incidentContainer}
                        preview={wizardDefinition[key].preview}
                      />
                      : ''}

                    {wizardDefinition[key].form ?
                      <IncidentForm
                        fieldConfig={wizardDefinition[key].form}
                        incidentContainer={incidentContainer}
                        getClassification={getClassification}
                        setIncident={setIncident}
                        createIncident={createIncident}
                        wizard={wizardDefinition}
                        isAuthenticated={isAuthenticated}
                      />
                      : ''}
                  </Step>
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
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

export default IncidentWizard;
