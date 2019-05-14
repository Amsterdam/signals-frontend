import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash.isarray';
import isString from 'lodash.isstring';

import mapDynamicFields from '../../../services/map-dynamic-fields';
import './style.scss';

function renderText(value, incident) {
  if (React.isValidElement(value)) {
    return value;
  }
  return mapDynamicFields(value, { incident });
}

const PlainText = ({ meta, parent }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <div className={`${meta.type} plain-text__box`}>
          <div className="label">{meta.label}</div>
          {meta.value && isString(meta.value) ?
            renderText(meta.value, parent && parent.meta && parent.meta.incidentContainer && parent.meta.incidentContainer.incident)
            : ''
          }

          {meta.value && isArray(meta.value) ?
            meta.value.map((paragraph, key) => (
              <div
                key={`${meta.name}-${key + 1}`}
                className={`plain-text__box-p plain-text__box-p-${key + 1}`}
              >{renderText(paragraph, parent && parent.meta && parent.meta.incidentContainer && parent.meta.incidentContainer.incident)}</div>
            ))
            : ''
          }
        </div>
      </div>
       : ''}
  </div>
);

PlainText.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default PlainText;
