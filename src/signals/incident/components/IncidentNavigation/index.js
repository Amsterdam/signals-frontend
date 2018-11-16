/**
*
* IncidentNavigation
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';

import './style.scss';

const IncidentNavigation = ({ valid, controls, meta: { wizard, handleSubmit } }) => {
  const showSubmit = controls.navigation_submit_button && controls.navigation_submit_button.meta && controls.navigation_submit_button.meta ? controls.navigation_submit_button.meta.isVisible : true;
  return (
    <span>
      <WithWizard
        render={({ next, previous, step }) => {
          const wizardStep = wizard[step.id.split('/').pop()];
          return (
            <div className="incident-navigation">
              {showSubmit && wizardStep.previousButtonLabel ? (
                <button
                  className={`incident-navigation__button  ${wizardStep.previousButtonClass}`}
                  onClick={previous}
                >
                  {wizardStep.previousButtonLabel}
                </button>
              ) : <span /> }

              {showSubmit && wizardStep.nextButtonLabel && (
                <button
                  className={`incident-navigation__button  ${wizardStep.nextButtonClass}`}
                  onClick={(e) => {
                    if (valid) {
                      e.persist();
                      e.stepId = step.id;
                      handleSubmit(e);
                      next();
                    }
                  }}
                >
                  {wizardStep.nextButtonLabel}
                </button>
              )}
            </div>
          );
        }}
      />
    </span>
  );
};

IncidentNavigation.defaultProps = {
  meta: {}
};

IncidentNavigation.propTypes = {
  valid: PropTypes.bool.isRequired,
  controls: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    wizard: PropTypes.object,
    handleSubmit: PropTypes.function
  })
};

export default IncidentNavigation;
