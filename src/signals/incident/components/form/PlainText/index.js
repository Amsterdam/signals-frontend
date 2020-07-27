import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isString from 'lodash.isstring';
import get from 'lodash.get';

import mapDynamicFields from '../../../services/map-dynamic-fields';
import './style.scss';

function renderText(value, parent) {
  if (React.isValidElement(value)) {
    return value;
  }

  return mapDynamicFields(value, { incident: get(parent, 'meta.incidentContainer.incident') });
}

const Label = styled.div`
  font-family: Avenir Next LT W01 Demi;
`;

const PlainText = ({ meta, parent }) =>
  meta?.isVisible && (
    <div className={`${meta.type || ''} plain-text__box`}>
      <Label>{meta.label}</Label>
      {meta.value && isString(meta.value) && renderText(meta.value, parent)}

      {meta.value &&
        Array.isArray(meta.value) &&
        meta.value.map((paragraph, key) => (
          <div key={`${meta.name}-${key + 1}`} className={`plain-text__box-p plain-text__box-p-${key + 1}`}>
            {renderText(paragraph, parent)}
          </div>
        ))}
    </div>
  );

PlainText.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default PlainText;
