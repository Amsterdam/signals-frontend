import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import isString from 'lodash.isstring';
import get from 'lodash.get';
import { isAuthenticated } from 'shared/services/auth/auth';

import { themeColor, themeSpacing } from '@amsterdam/asc-ui';
import mapDynamicFields from 'signals/incident/services/map-dynamic-fields';

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

const getStyle = type => {
  switch (type) {
    case 'alert':
      return css`
        color: ${themeColor('secondary')};
        border: 2px solid ${themeColor('secondary')};
        padding: ${themeSpacing(2, 5)};
        font-family: Avenir Next LT W01 Demi;
      `;
    case 'citation':
    case 'disclaimer':
      return css`
        background-color: ${themeColor('tint', 'level3')};
        padding: ${themeSpacing(5)};
      `;
    case 'caution':
      return css`
        border-left: 3px solid ${themeColor('secondary')};
        padding-left: ${themeSpacing(3)};
      `;
    case 'alert-inverted':
      return css`
        background-color: ${themeColor('secondary')};
        color: ${themeColor('tint', 'level1')};
        padding: ${themeSpacing(4)};
        font-family: Avenir Next LT W01 Demi;
      `;
    default:
      return null;
  }
};

const Wrapper = styled.div`
  ul {
    padding: ${themeSpacing(0, 0, 0, 6)};
    margin: 0;

    li {
      list-style-type: square;
    }
  }

  ${({ type }) => getStyle(type)}
`;

const Value = styled.div`
  margin-bottom: ${themeSpacing(4)};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PlainText = ({ className, meta, parent }) =>
  meta?.isVisible && (
    <Wrapper className={className} type={meta.type} data-testid="plainText">
      {meta.label && <Label>{meta.label}</Label>}

      {meta.value && isString(meta.value) && <Value>{renderText(meta.value, parent)}</Value>}

      {meta.value &&
        Array.isArray(meta.value) &&
        meta.value.map((paragraph, key) => (
          <Value key={`${meta.name}-${key + 1}`}>{renderText(paragraph, parent)}</Value>
        ))}
    </Wrapper>
  );

PlainText.defaultProps = {
  className: '',
};

PlainText.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default PlainText;
