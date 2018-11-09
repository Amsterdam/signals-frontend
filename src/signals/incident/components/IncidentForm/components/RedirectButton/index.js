import React from 'react';
import PropTypes from 'prop-types';

import mapDynamicFields from '../../services/map-dynamic-fields';
import './style.scss';

function redirect(action, timeout) {
  global.window.setTimeout(() => (window.location.href = action), timeout);
}

const RedirectButton = ({ meta, parent }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <div className={`${meta.type} plain-text__box`}>
          <div className="label">{meta.label}</div>

          {meta.value && typeof meta.value === 'string' ?
            mapDynamicFields(meta.value, { incident: parent && parent.meta && parent.meta.incidentContainer && parent.meta.incidentContainer.incident })
            : ''
          }

          {meta.buttonTimeout ? redirect(meta.buttonAction, meta.buttonTimeout) : ''}

          {meta.value && typeof meta.value !== 'string' ?
            meta.value.map((paragraph, key) => (
              <div
                key={`${meta.name}-${key + 1}`}
                className={`plain-text__box-p plain-text__box-p-${key + 1}`}
              >{mapDynamicFields(paragraph, { incident: parent && parent.meta && parent.meta.incidentContainer && parent.meta.incidentContainer.incident })}</div>
            ))
            : ''
          }

          {meta.buttonTimeout ? <div className="plain-text__box-p">U wordt automatisch doorgestuurd binnen {meta.buttonTimeout / 1000} seconden.</div> : ''}

          <div>
            <a href={meta.buttonAction} className="action primary">{meta.buttonLabel}</a>
          </div>
        </div>
      </div>
       : ''}
  </div>
);

RedirectButton.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default RedirectButton;
