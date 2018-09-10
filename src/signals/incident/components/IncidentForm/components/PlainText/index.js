import React from 'react';
import PropTypes from 'prop-types';

import mapDynamicFields from '../../services/map-dynamic-fields';
import './style.scss';

const PlainText = ({ meta, parent }) => (
  <div>
    {meta && meta.isVisible ?
      <div className="row mode_input plain-text">
        <div className={`${meta.className || 'col-12'}`}>
          <div className={`${meta.type} plain-text__box`}>
            <div className="label">{meta.label}</div>

            {meta.value && typeof meta.value === 'string' ?
              mapDynamicFields(meta.value, { incident: parent && parent.meta && parent.meta.incidentContainer && parent.meta.incidentContainer.incident })
              : ''
            }

            {meta.value && typeof meta.value !== 'string' ?
              meta.value.map((paragraph, key) => (
                <div
                  key={`${meta.name}-${key + 1}`}
                  className={`plain-text__box-p plain-text__box-p-${key + 1}`}
                >{mapDynamicFields(paragraph, { incident: parent && parent.meta && parent.meta.incidentContainer && parent.meta.incidentContainer.incident })}</div>
              ))
              : ''
            }
          </div>
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
