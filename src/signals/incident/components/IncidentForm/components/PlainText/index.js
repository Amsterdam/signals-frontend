/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import { isArray, isObject, isString } from 'lodash';

import mapDynamicFields from '../../services/map-dynamic-fields';
import './style.scss';

function renderText(value, incident) {
  if (isObject(value)) {
    switch (value.type) {
      case 'more-link':
        return <a href={value.href} className="more-link">{mapDynamicFields(value.label, { incident })}</a>;

      case 'list':
        return <span>{value.title}<ul>{value.items && value.items.map((item, key) => <li key={key}>{item}</li>)}</ul></span>;

      default:
        return '';
    }
  } else {
    return mapDynamicFields(value, { incident });
  }
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
