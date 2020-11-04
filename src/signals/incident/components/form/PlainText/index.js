import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import isString from 'lodash.isstring';
import get from 'lodash.get';
import { isAuthenticated } from 'shared/services/auth/auth';

import { themeColor } from '@amsterdam/asc-ui';
import mapDynamicFields from '../../../services/map-dynamic-fields';
import './style.scss';

// This control will disable all the links when the user is not authenticated.
const Span = styled.span`
  ${({ authenticated }) =>
    authenticated
      ? css`
          a {
            color: ${themeColor('primary')};
            font-weight: bold;
          }
        `
      : css`
          a {
            pointer-events: none;
            cursor: default;
            text-decoration: none;
            color: inherit;
          }
        `}
`;

const renderText = (value, parent) => {
  if (React.isValidElement(value)) {
    return value;
  }

  const text = mapDynamicFields(value, { incident: get(parent, 'meta.incidentContainer.incident') });
  return (
    <Span
      data-testid="plainText"
      authenticated={isAuthenticated()}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
};

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
