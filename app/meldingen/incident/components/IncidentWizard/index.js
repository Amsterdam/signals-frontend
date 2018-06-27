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

import wizard from '../../definitions/wizard';

import IncidentForm from '../IncidentForm';
import IncidentPreview from '../IncidentPreview';
import './style.scss';

const subcategoriesWithExtraQuestions = [
  'Overlast op het water - geluid',
  'Overlast op het water - snel varen',
  'Overlast op het water - Gezonken boot'
];

function onNext({ step, push }, incident) {
  if (step.id === 'incident/beschrijf' && !subcategoriesWithExtraQuestions.includes(incident.subcategory)) {
    push('incident/telefoon');
  } else {
    push();
  }
}

function IncidentWizard({ getClassification, setIncident, incident }) {
  return (
    <BrowserRouter>
      <div className="incident-wizard">
        <Route
          render={({ history }) => (
            <Wizard history={history} onNext={(wiz) => onNext(wiz, incident)}>
              <Steps>
                {Object.keys(wizard).map((key) => (
                  <Step key={key} id={`incident/${key}`}>
                    <h2>{wizard[key].label || key}</h2>
                    {wizard[key].preview ?
                      <IncidentPreview
                        incident={incident}
                        preview={wizard[key].preview}
                      />
                      : ''}

                    {wizard[key].form ?
                      <IncidentForm
                        fieldConfig={wizard[key].form}
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
