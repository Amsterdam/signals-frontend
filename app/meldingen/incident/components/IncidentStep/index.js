/**
*
* IncidentStep
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

function IncidentStep() {
  return (
    <div className="incident-step">
      <FormattedMessage {...messages.header} />
    </div>
  );
}

IncidentStep.propTypes = {

};

export default IncidentStep;
