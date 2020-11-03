import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { breakpoint, List, ListItem, themeColor, themeSpacing } from '@amsterdam/asc-ui';

export const STATUS_NONE = 'components/ChildIncidents/STATUS_NONE';
export const STATUS_RESPONSE_REQUIRED = 'components/ChildIncidents/STATUS_RESPONSE_REQUIRED';

// Fixed width for the child element attributes
const ID_VALUE_WIDTH = 64;
const STATE_VALUE_WIDTH = 228;

const DisplayValue = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Li = styled(ListItem)`
  display: flex;
  background-color: ${themeColor('tint', 'level3')};
  margin: 0;
  padding: 0;
  position: relative;

  & + & {
    margin-top: ${themeSpacing(1)};
  }

  ${({ status }) => {
    switch (status) {
      case STATUS_RESPONSE_REQUIRED:
        return css`
          &::before {
            background-color: ${themeColor('support', 'focus')};
            border-right: 2px solid white;
            bottom: 0;
            content: '';
            left: 0;
            position: absolute;
            width: ${themeSpacing(1.5)};
            top: 0;
          }
        `;

      case STATUS_NONE:
      default:
        return null;
    }
  }}

  & > a {
    &:hover > :first-child {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }

  & > * {
    padding: ${themeSpacing(3, 5, 3, 4)};
    display: flex;
    width: 100%;
    text-decoration: none;
    color: black;

    @media screen and ${breakpoint('max-width', 'laptop')} {
      flex-wrap: wrap;
    }

    & > * {
      margin-right: ${themeSpacing(4)};

      :first-child {
        flex: 0 0 ${ID_VALUE_WIDTH}px;
      }

      :nth-child(2) {
        flex: 0 0 ${STATE_VALUE_WIDTH}px;
      }

      :nth-child(2) ~ * {
        @media screen and ${breakpoint('max-width', 'laptop')} {
          flex: 0 0 100%;
        }
      }
    }
  }

  ${({ changed }) =>
    changed &&
    css`
      border-left: 4px solid ${themeColor('support', 'focus')};

      & > a {
        border-left: 2px solid white;
        padding-left: ${themeSpacing(2)};
      }
    `}
`;

const ChildIncidents = ({ className, incidents }) => (
  <List className={className} data-testid="childIncidents">
    {incidents.map(({ href, status, values, changed }) => {
      const valueEntries = Object.entries(values).map(([key, value]) => (
        <DisplayValue key={key} title={value}>
          {value}
        </DisplayValue>
      ));

      return (
        <Li key={JSON.stringify(values)} status={status} numValues={values.length} changed={changed}>
          {href ? <Link to={href}>{valueEntries}</Link> : <div>{valueEntries}</div>}
        </Li>
      );
    })}
  </List>
);

ChildIncidents.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  incidents: PropTypes.arrayOf(
    PropTypes.exact({
      href: PropTypes.string,
      status: PropTypes.string,
      values: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
      }),
      changed: PropTypes.bool.isRequired,
    })
  ),
};

export default ChildIncidents;
