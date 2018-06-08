/**
*
* IncidentNavigation
*
*/

import React from 'react';
import { WithWizard } from 'react-albus';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

const IncidentNavigation = () => (
  <WithWizard
    render={({ next, previous, step, steps }) => (
      <div className="incident-navigation">
        {steps.indexOf(step) > 0 && (
          <button className="incident-navigation__button" onClick={previous}>
            <FormattedMessage {...messages.previous} />
          </button>
        )}

        {steps.indexOf(step) < steps.length - 1 && (
          <button className="incident-navigation__button" onClick={next}>
            <FormattedMessage {...messages.next} />
          </button>
        )}
      </div>
    )}
  />
);

export default IncidentNavigation;
