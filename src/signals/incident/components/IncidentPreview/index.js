/**
*
* IncidentPreview
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { WithWizard } from 'react-albus';

import isVisible from './services/is-visible';

import './style.scss';

function IncidentPreview({ incidentContainer, preview, isAuthenticated }) {
  return (
    <div className="incident-preview">
      {Object.keys(preview).map((key) => (
        <div className="incident-preview__section" key={key}>
          <WithWizard
            render={({ push }) => (
              <button
                className="incident-preview__button-edit link-functional edit"
                onClick={() => push(`incident/${key}`)}
              />
            )}
          />

          {Object.keys(preview[key]).map((subkey) => (
            <div key={subkey}>
              {isVisible(incidentContainer.incident[subkey], preview[key][subkey], isAuthenticated) ?
                preview[key][subkey].render({
                  ...preview[key][subkey],
                  value: incidentContainer.incident[subkey],
                  incident: incidentContainer.incident
                })
              : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

IncidentPreview.propTypes = {
  incidentContainer: PropTypes.object,
  preview: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

export default IncidentPreview;
