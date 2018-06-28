/**
*
* IncidentWizard
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

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

function IncidentWizard({ getClassification, setIncident, incident }) {
  return (
    <BrowserRouter>
      <div className="incident-wizardDefinition">
        <Route
          render={({ history }) => (
            <Wizard history={history} onNext={(wiz) => onNext(wiz, incident)}>
              <Steps>
                {Object.keys(wizardDefinition).map((key) => (
                  <Step key={key} id={`incident/${key}`}>
                    <h2>{wizardDefinition[key].label || key}</h2>
                    {wizardDefinition[key].preview ?
                      <IncidentPreview
                        incident={incident}
                        preview={wizardDefinition[key].preview}
                      />
                      : ''}

                    {wizardDefinition[key].form ?
                      <IncidentForm
                        fieldConfig={wizardDefinition[key].form}
                        incident={incident}
                        getClassification={getClassification}
                        setIncident={setIncident}
                      />
                      : ''}
                  </Step>
                )
                )}
              </Steps>
            </Wizard>
          )}
        />
      </div>
    </BrowserRouter>
  );
}

IncidentWizard.propTypes = {
  incident: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired
};

export default IncidentWizard;
