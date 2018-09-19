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
            <div className="incident-preview__section" key={key}>
              <button
                className="incident-preview__button-edit link-functional edit"
                onClick={() => push(`incident/${key}`)}
              />

              {Object.keys(preview[key]).map((subkey) => (
                <div key={subkey}>
                  {preview[key][subkey].render({
                    ...preview[key][subkey],
                    value: incidentContainer.incident[subkey],
                    incident: incidentContainer.incident
                  })}
                </div>
              ))}
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
