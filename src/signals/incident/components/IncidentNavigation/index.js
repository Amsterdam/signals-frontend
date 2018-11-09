/**
*
* IncidentNavigation
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';
import { findIndex } from 'lodash';

import './style.scss';

const IncidentNavigation = ({ valid, controls, meta: { handleSubmit } }) => {
  const showSubmit = controls.navigation_submit_button && controls.navigation_submit_button.meta && controls.navigation_submit_button.meta ? controls.navigation_submit_button.meta.isVisible : true;
  return (
    <span>
      <WithWizard
        render={({ next, previous, step, steps }) => (
          <div className="incident-navigation">
            {findIndex(steps, step) > 0 ? (
              <button className="incident-navigation__button action startagain" onClick={previous}>
                Vorige
              </button>
            ) : <span /> }

            {showSubmit && findIndex(steps, step) < steps.length - 1 && (
              <button
                className={`incident-navigation__button action primary ${step.id === 'incident/samenvatting' ? '' : 'arrow-right'}`}
                onClick={(e) => {
                  if (valid) {
                    e.persist();
                    e.stepId = step.id;
                    handleSubmit(e);
                    next();
                  }
                }}
              >
                {step.id === 'incident/samenvatting' ?
                  'Verstuur'
                :
                  'Volgende'
                }
              </button>
            )}
          </div>
        )}
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
    handleSubmit: PropTypes.function
  })
};

export default IncidentNavigation;
