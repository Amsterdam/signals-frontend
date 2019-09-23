/**
 *
 * IncidentNavigation
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';

import './style.scss';

const IncidentNavigation = ({ controls, meta: { wizard, submitting, handleSubmit } }) => {
  const hideSubmit =
    controls.hide_navigation_buttons && controls.hide_navigation_buttons.meta && controls.hide_navigation_buttons.meta
      ? controls.hide_navigation_buttons.meta.isVisible
      : false;
  return (
    <span>
      <WithWizard
        render={({ next, previous, step }) => {
          const currentStep = (step && step.id && step.id.split('/').pop()) || 0;
          const wizardStep = currentStep && wizard[currentStep];

          return (
            <div>
              {wizardStep ? (
                <div className="incident-navigation">
                  {!hideSubmit && wizardStep.previousButtonLabel ? (
                    <button
                      className={`incident-navigation__button  ${wizardStep.previousButtonClass}`}
                      onClick={previous}
                      type="button"
                    >
                      {wizardStep.previousButtonLabel}
                    </button>
                  ) : (
                    <span />
                  )}

                  {!hideSubmit && wizardStep.nextButtonLabel && (
                    <button
                      className={`incident-navigation__button incident-navigation__button--next  ${wizardStep.nextButtonClass}`}
                      onClick={e => handleSubmit(e, next, wizardStep.formAction)}
                      type="submit"
                    >
                      <span className="value">{wizardStep.nextButtonLabel}</span>
                      {submitting ? (
                        <span className="working">
                          <div className="progress-indicator progress-white"></div>
                        </span>
                      ) : (
                        ''
                      )}
                    </button>
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />
    </span>
  );
};

IncidentNavigation.defaultProps = {
  meta: {},
};

IncidentNavigation.propTypes = {
  controls: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    wizard: PropTypes.object,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
  }),
};

export default IncidentNavigation;
