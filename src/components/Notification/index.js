import React, { useEffect, useState } from 'react';
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

export const TYPE_ERROR = 'error';
export const TYPE_NOTICE = 'notice';
export const TYPE_SUCCESS = 'success';
export const TYPE_DEFAULT = TYPE_NOTICE;

export const ONCLOSE_TIMEOUT = 8000;
export const SLIDEUP_TIMEOUT = 300;

const Wrapper = styled.div`
  background-color: ${({ type }) => {
    switch (type) {
      case TYPE_ERROR:
        return themeColor('support', 'invalid');
      case TYPE_SUCCESS:
        return themeColor('support', 'valid');
      default:
        return themeColor('primary');
    }
  }};

  align-items: center;
  display: flex;
  margin-left: 50vw;
  max-width: 1400px;
  min-height: 44px;
  position: fixed;
  top: ${({ isFrontOffice, tall }) => (isFrontOffice && tall ? 116 : 50)}px;
  transform: translateX(-50vw) translateY(0);
  transition: transform ${SLIDEUP_TIMEOUT}ms ease-in;
  width: 100vw;
  will-change: transform;
  z-index: 1;

  @media (min-width: 1400px) {
    margin-left: 50%;
    transform: translateX(-50%) translateY(0);
  }

  &.slideup {
    transform: translateX(-50vw) translateY(-116px);

    @media (min-width: 1400px) {
      transform: translateX(-50%) translateY(-116px);
    }
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
 */
const Notification = ({ title, message, onClose, className, type }) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  let onCloseTimeout;
  let slideUpTimeout;

  useEffect(() => {
    if (type === TYPE_ERROR) return undefined;

    if (hasFocus) {
      global.clearTimeout(onCloseTimeout);
      global.clearTimeout(slideUpTimeout);
    } else {
      onCloseTimeout = global.setTimeout(() => {
        global.clearTimeout(onCloseTimeout);
        onClose();
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
  }, [hasFocus, onCloseTimeout, slideUpTimeout, type]);

  return (
    <Wrapper
      className={`${className} ${slideUp && 'slideup'}`}
      onMouseLeave={() => setHasFocus(false)}
      onMouseEnter={() => setHasFocus(true)}
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
            icon={<Close onClick={onClose} />}
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
  type: TYPE_NOTICE,
};

Notification.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf([TYPE_ERROR, TYPE_NOTICE, TYPE_SUCCESS]),
};

export default Notification;
