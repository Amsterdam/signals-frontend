import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { List, ListItem, themeColor, themeSpacing } from '@datapunt/asc-ui';

export const STATUS_NONE = 'components/ChildIncidents/STATUS_NONE';
export const STATUS_RESPONSE_REQUIRED = 'components/ChildIncidents/STATUS_RESPONSE_REQUIRED';

const FIRST_VALUE_WIDTH = 100;
const LAST_VALUE_WIDTH = 80;

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
    padding: ${themeSpacing(3, 5, 3, 7)};
    display: flex;
    width: 100%;
    text-decoration: none;
    color: black;

    @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
      flex-wrap: wrap;
      justify-content: space-between;
    }

    & > :not(:first-child):not(:last-child) {
      flex: 1 1
        calc(
          50% -
            ${({ numValues }) => (numValues > 3 ? (FIRST_VALUE_WIDTH + LAST_VALUE_WIDTH) / 2 : FIRST_VALUE_WIDTH / 2)}px
        );

      @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
        flex: 0 0 auto;
        min-width: 150px;
      }
    }

    & > :first-child {
      flex: 0 0 ${FIRST_VALUE_WIDTH}px;

      @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
        flex: 0 0 100%;
      }
    }

    & > *:nth-last-child(4) ~ *:last-child {
      flex: 0 0 100%;

      @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
        display: flex;
        justify-content: flex-end;
        flex: 0 0 ${FIRST_VALUE_WIDTH}px;
      }
    }
  }
`;

const ChildIncidents = ({ className, incidents }) => (
  <List className={className} data-testid="childIncidents">
    {incidents.map(({ href, status, values }) => {
      const valueEntries = Object.entries(values).map(([key, value]) => (
        <span key={key} title={key}>
          {value}
        </span>
      ));

      return (
        <Li key={JSON.stringify(values)} status={status} numValues={values.length}>
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
    })
  ),
};

export default ChildIncidents;
