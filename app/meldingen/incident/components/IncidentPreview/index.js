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

function IncidentPreview({ incident, preview }) {
  return (
    <WithWizard
      render={({ push }) => (
        <div className="incident-preview">
          {Object.keys(preview).map((key) => (
            <div key={key}>
              <button
                className="link-to-step"
                onClick={() => push(`incident/${key}`)}
              >
                bewerk
              </button>

              <ul key={key}>
                {Object.keys(preview[key]).map((subkey) => (
                  <li key={subkey}>
                    {preview[key][subkey].render({
                      label: preview[key][subkey].label,
                      value: incident[subkey],
                      incident
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
  incident: PropTypes.object,
  preview: PropTypes.object
};

export default IncidentPreview;
