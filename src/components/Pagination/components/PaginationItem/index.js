// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import {
  Button,
  Icon,
  Link as AscLink,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { ChevronLeft, ChevronRight } from '@amsterdam/asc-assets'

import { NEXT, PREVIOUS } from '../../utils'

const StyledItem = styled(AscLink)`
  align-items: center;
  color: black;
  cursor: pointer;
  display: flex;
  font-family: Avenir Next LT W01-Regular, arial, sans-serif;
  height: 100%;
  margin: 0;
  outline: none;
  padding: 0 ${themeSpacing(2)};
  text-decoration: none;
  font-weight: normal;

  &:focus {
    background-color: ${themeColor('support', 'focus')};
    color: ${themeColor('secondary')};

    svg path {
      fill: ${themeColor('secondary')};
    }
  }

  &:hover {
    text-decoration: underline;

    svg path {
      fill: ${themeColor('secondary')};
    }
  }

  ${(props) =>
    props['data-isnav'] &&
    css`
      font-family: Avenir Next LT W01 Demi, arial, sans-serif;
    `}

  ${(props) =>
    props['data-isnav'] &&
    props['data-pagenum'] === PREVIOUS &&
    css`
      padding-left: 0;

      span {
        margin-right: ${themeSpacing(1)};
      }
    `}

  ${(props) =>
    props['data-isnav'] &&
    props['data-pagenum'] === NEXT &&
    css`
      padding-right: 0;

      span {
        margin-left: ${themeSpacing(1)};
      }
    `}
`

const PaginationItem = ({
  shouldPushToHistory,
  pageNum,
  onClick,
  to,
  label,
  isNav,
}) => {
  const anchorProps = {
    as: Link,
    to,
  }
  const buttonProps = {
    as: Button,
    variant: 'textButton',
  }
  // setting props as data- attributes, because React will complain about invalid HTML attributes otherwise
  const commonProps = {
    'data-isnav': isNav,
    'data-pagenum': pageNum,
    'data-testid': isNav ? `pagination-${pageNum.toLowerCase()}` : null,
    onClick,
  }

  const props = shouldPushToHistory ? anchorProps : buttonProps

  return (
    <StyledItem {...commonProps} {...props}>
      {isNav ? (
        <Fragment>
          {pageNum === NEXT && label}

          <Icon size={12}>
            {pageNum === NEXT && <ChevronRight />}
            {pageNum === PREVIOUS && <ChevronLeft />}
          </Icon>

          {pageNum === PREVIOUS && label}
        </Fragment>
      ) : (
        label
      )}
    </StyledItem>
  )
}

PaginationItem.defaultProps = {
  isNav: false,
  onClick: null,
  shouldPushToHistory: false,
  to: '',
}

PaginationItem.propTypes = {
  /** When true, will apply different styling for navigation items (like next and prev) */
  isNav: PropTypes.bool,
  /** Text label */
  label: PropTypes.node.isRequired,
  /* Callback */
  onClick: PropTypes.func,
  /** Page number indicator */
  pageNum: PropTypes.oneOfType([
    PropTypes.oneOf([NEXT, PREVIOUS]),
    PropTypes.number,
  ]).isRequired,
  /** When true, will render a Link component instead of a Button component */
  shouldPushToHistory: PropTypes.bool,
  /** Target URL */
  to: PropTypes.string,
}

export default PaginationItem
