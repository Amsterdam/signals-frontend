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

import IncidentNavigation from '../IncidentNavigation';
import './style.scss';

function IncidentWizard({ match }) {
  console.log('match', match);
  return (
    <BrowserRouter>
      <div className="incident-wizard">
        <div className="row pad-t">
          <div className="col-xs-6 col-xs-offset-3">
            <Route
              render={({ history }) => (
                <Wizard history={history}>
                  <Steps>
                    <Step id="incident/gandalf">
                      <h1 className="text-align-center">Gandalf</h1>
                    </Step>
                    <Step id="incident/dumbledore">
                      <h1 className="text-align-center">Dumbledore</h1>
                    </Step>
                    <Step id="incident/ice-king">
                      <h1 className="text-align-center">Ice King</h1>
                    </Step>
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

IncidentWizard.propTypes = {
  match: PropTypes.object
};

export default IncidentWizard;
