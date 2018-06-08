/**
*
* IncidentWizard
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

function IncidentWizard() {
  return (
    <div className="incident-wizard">
      <FormattedMessage {...messages.header} />
    </div>
  );
}

IncidentWizard.propTypes = {

};

export default IncidentWizard;
