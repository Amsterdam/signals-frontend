import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Button,
  Column,
  Heading,
  Paragraph,
  Row,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui';
import { Close } from '@datapunt/asc-assets';
import { ascDefaultTheme as theme } from '@datapunt/asc-core';
import {
  SITE_HEADER_BOTTOM_GAP_HEIGHT,
  SITE_HEADER_HEIGHT_SHORT,
  SITE_HEADER_HEIGHT_TALL,
} from 'containers/SiteHeader/constants';

import {
  ONCLOSE_TIMEOUT,
  SLIDEUP_TIMEOUT,
  TYPE_DEFAULT,
  TYPE_GLOBAL,
  TYPE_LOCAL,
  VARIANT_DEFAULT,
  VARIANT_ERROR,
  VARIANT_NOTICE,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants';
import { isAuthenticated } from 'shared/services/auth/auth';
import useLocation from 'hooks/useLocation';

export const BG_COLOR_ERROR = themeColor('support', 'invalid')({ theme });
export const BG_COLOR_NOTICE = themeColor('primary')({ theme });
export const BG_COLOR_SUCCESS = themeColor('support', 'valid')({ theme });

const Wrapper = styled.div`
  background-color: ${({ variant }) => {
    switch (variant) {
      case VARIANT_ERROR:
        return BG_COLOR_ERROR;
      case VARIANT_SUCCESS:
        return BG_COLOR_SUCCESS;
      default:
        return BG_COLOR_NOTICE;
    }
  }};

  align-items: center;
  display: flex;
  margin-left: 50vw;
  max-width: 1400px;
  min-height: ${SITE_HEADER_BOTTOM_GAP_HEIGHT}px;
  position: ${({ top }) =>
    top === SITE_HEADER_HEIGHT_TALL ? 'absolute' : 'fixed'};
  top: ${({ top }) => top}px;
  transform: translateX(-50vw) translateY(0);
  transition: transform ${SLIDEUP_TIMEOUT}ms ease-out;
  width: 100vw;
  will-change: transform;
  z-index: 1;

  @media (min-width: 1400px) {
    margin-left: 50%;
    transform: translateX(-50%) translateY(0);
  }

  &.slideup {
    ${({ top }) => css`
      transform: translateX(-50vw) translateY(-${top}px);

      @media (min-width: 1400px) {
        transform: translateX(-50%) translateY(-${top}px);
      }
    `}
  }

  @media (min-width: 1400px) {
    width: 100%;
  }

  & > * {
    width: 100%;
  }
`;

const Title = styled(Heading).attrs({
  $as: 'h6',
})`
  color: white;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal;
  margin: ${({ hasMargin }) =>
    hasMargin
      ? css`
          ${themeSpacing(2)} 0 0
        `
      : 0};

  & + & {
    margin-top: ${themeSpacing(2)};
  }
`;

const Message = styled(Paragraph)`
  color: white;
  margin: 0 0 ${themeSpacing(2)};
  font-size: 16px;
`;

const CloseButton = styled(Button)`
  ${({ alignTop }) =>
    alignTop
      ? css`
          margin-top: ${themeSpacing(2)};
        `
      : css`
          align-self: center;
        `}

  margin-left: ${themeSpacing(3)};

  &,
  &:hover {
    background-color: transparent;
  }

  & svg path {
    fill: white !important;
  }
`;

/**
 * Component that shows a title, a close button and, optionally, a message in a full-width bar with a coloured background
 * The component slides up automatically after eight seconds, but only when its variant is not VARIANT_ERROR.
 */
const Notification = ({ title, message, onClose, className, type, variant }) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const { isFrontOffice } = useLocation();
  const tall = isFrontOffice && !isAuthenticated();

  let onCloseTimeout;
  let slideUpTimeout;

  useEffect(() => {
    if (variant === VARIANT_ERROR) return undefined;

    if (hasFocus) {
      global.clearTimeout(onCloseTimeout);
      global.clearTimeout(slideUpTimeout);
    } else {
      onCloseTimeout = global.setTimeout(() => {
        global.clearTimeout(onCloseTimeout);

        if (typeof onClose === 'function') {
          onClose();
        }
      }, ONCLOSE_TIMEOUT + SLIDEUP_TIMEOUT);

      slideUpTimeout = global.setTimeout(() => {
        global.clearTimeout(slideUpTimeout);
        setSlideUp(true);
      }, ONCLOSE_TIMEOUT);
    }

    return () => {
      global.clearTimeout(onCloseTimeout);
      global.clearTimeout(slideUpTimeout);
    };
  }, [hasFocus, onCloseTimeout, slideUpTimeout, variant]);

  const onCloseNotification = useCallback(() => {
    setSlideUp(true);

    slideUpTimeout = global.setTimeout(() => {
      global.clearTimeout(slideUpTimeout);

      if (typeof onClose === 'function') {
        onClose();
      }
    }, SLIDEUP_TIMEOUT);
  }, [slideUpTimeout, SLIDEUP_TIMEOUT, onClose, setSlideUp]);

  const top =
    isFrontOffice && tall
      ? SITE_HEADER_HEIGHT_TALL
      : SITE_HEADER_HEIGHT_SHORT;

  return (
    <Wrapper
      className={`${className} ${slideUp && 'slideup'}`}
      onMouseLeave={() => setHasFocus(false)}
      onMouseEnter={() => setHasFocus(true)}
      top={top}
      variant={variant}
      type={type}
    >
      <Row>
        <Column span={12}>
          <div>
            <Title hasMargin={Boolean(message)}>{title}</Title>
            {message && <Message>{message}</Message>}
          </div>
          <CloseButton
            alignTop={Boolean(message)}
            icon={<Close onClick={onCloseNotification} />}
            size={20}
            variant="blank"
          />
        </Column>
      </Row>
    </Wrapper>
  );
};

Notification.defaultProps = {
  className: '',
  onClose: null,
  type: TYPE_DEFAULT,
  variant: VARIANT_DEFAULT,
};

Notification.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Optional notifaction description */
  message: PropTypes.string,
  /** Close button callback handler */
  onClose: PropTypes.func,
  /** Short, descriptive notice */
  title: PropTypes.string.isRequired,
  /** One of two possible scopes */
  type: PropTypes.oneOf([TYPE_GLOBAL, TYPE_LOCAL]),
  /** One of three possible appearance variants */
  variant: PropTypes.oneOf([VARIANT_ERROR, VARIANT_NOTICE, VARIANT_SUCCESS]),
};

export default Notification;
