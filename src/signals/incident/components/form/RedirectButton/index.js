import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function redirect(action, timeout) {
  global.window.setTimeout(() => global.window.location.assign(action), timeout);
}

const RedirectButton = ({ meta }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible
      ? (
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <div className={`${meta.type} redirect-button__box`}>
            <div className="label">{meta.label}</div>

            {(Array.isArray(meta.value) ? meta.value : [meta.value]).map((paragraph, key) => (
              <div
                key={`${meta.name}-${key + 1}`}
                className={`redirect-button__box-p redirect-button__box-p-${key + 1}`}
              >
                {paragraph}
              </div>
            ))}

            {meta.buttonTimeout ? redirect(meta.buttonAction, meta.buttonTimeout) : ''}
            {meta.buttonTimeout ? (
              <div className="redirect-button__box-p">
                U wordt automatisch doorgestuurd naar het juiste formulier over {meta.buttonTimeout / 1000} seconden.
              </div>
            ) : ''}

            <div>
              <a href={meta.buttonAction} className="action primary">{meta.buttonLabel}</a>
            </div>
          </div>
        </div>
      )
      : ''}
  </div>
);

RedirectButton.propTypes = {
  meta: PropTypes.object,
};

export default RedirectButton;
