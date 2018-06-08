/**
*
* IncidentWizard
*
*/

import React from 'react';
// import PropTypes from 'prop-types';
import { BrowserRouter, Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import wizard from '../../definitions/wizard';

import IncidentStep from '../IncidentStep';
import IncidentNavigation from '../IncidentNavigation';
import './style.scss';

function IncidentWizard() {
  Object.keys(wizard).map((key) => {
    console.log('key', key, wizard[key]);
    return true;
  });
  return (
    <BrowserRouter>
      <div className="incident-wizard">
        <div className="row pad-t">
          <div className="col-xs-6 col-xs-offset-3">
            <Route
              render={({ history }) => (
                <Wizard history={history}>
                  <Steps>
                    {Object.keys(wizard).map((key) => (
                      <Step key={key} id={`incident/${key}`}>
                        <h1 className="text-align-center">{key}</h1>
                        <IncidentStep content={wizard[key]} />
                      </Step>
                    )
                    )}
                  </Steps>
                  <IncidentNavigation />
                </Wizard>
              )}
            />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

// IncidentWizard.propTypes = {
// };

export default IncidentWizard;
