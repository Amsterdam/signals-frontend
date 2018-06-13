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

import IncidentStep from '../IncidentStep';
import './style.scss';

function IncidentWizard({ setIncident, incident }) {
  return (
    <BrowserRouter>
      <div className="incident-wizard">
        <Route
          render={({ history }) => (
            <Wizard history={history}>
              <Steps>
                {Object.keys(wizard).map((key) => (
                  <Step key={key} id={`incident/${key}`}>
                    <h1 className="text-align-center">{key}</h1>
                    <IncidentStep
                      content={wizard[key]}
                      setIncident={setIncident}
                      incident={incident}
                    />
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
  setIncident: PropTypes.func.isRequired
};

export default IncidentWizard;
