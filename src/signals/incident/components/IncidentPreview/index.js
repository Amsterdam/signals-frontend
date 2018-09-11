/**
*
* IncidentPreview
*
*/

import React from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
//      <FormattedMessage {...messages.header} />

import { WithWizard } from 'react-albus';

import './style.scss';

function IncidentPreview({ incidentContainer, preview }) {
  return (
    <WithWizard
      render={({ push }) => (
        <div className="incident-preview">
          {Object.keys(preview).map((key) => (
            <div key={key}>
              <button
                className="incident-preview__button-edit link-functional edit"
                onClick={() => push(`incident/${key}`)}
              />

              <ul key={key}>
                {Object.keys(preview[key]).map((subkey) => (
                  <li key={subkey}>
                    {preview[key][subkey].render({
                      label: preview[key][subkey].label,
                      value: incidentContainer.incident[subkey],
                      optional: preview[key][subkey].optional,
                      incident: incidentContainer.incident
                    })}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    />
  );
}

IncidentPreview.propTypes = {
  incidentContainer: PropTypes.object,
  preview: PropTypes.object
};

export default IncidentPreview;
