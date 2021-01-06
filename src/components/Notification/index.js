import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from '@amsterdam/asc-ui';
import { Close } from '@amsterdam/asc-assets';
import { useHistory } from 'react-router-dom';
import {
  SITE_HEADER_HEIGHT_SHORT,
  SITE_HEADER_HEIGHT_TALL,
} from 'containers/SiteHeader/constants';

import {
  ONCLOSE_TIMEOUT,
  SLIDEUP_TIMEOUT,
  TYPE_GLOBAL,
  TYPE_LOCAL,
  VARIANT_ERROR,
  VARIANT_NOTICE,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants';
import { isAuthenticated } from 'shared/services/auth/auth';
import useIsFrontOffice from 'hooks/useIsFrontOffice';

import { Wrapper, Title, Message, CloseButton } from './styled';

/**
 * Component that shows a title, a close button and, optionally, a message in a full-width bar with
 * a coloured background. The component slides up automatically after eight seconds, but only when
 * its variant is not VARIANT_ERROR and its type is not TYPE_GLOBAL.
 */
const Notification = ({
  title,
  message,
  onClose,
  className,
  type,
  variant,
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const isFrontOffice = useIsFrontOffice();
  const tall = isFrontOffice && !isAuthenticated();
  const history = useHistory();

  // persisting timeout IDs across renders
  const onCloseTimeoutRef = useRef();
  const slideUpTimeoutRef = useRef();

  /**
   * Subscribe to history changes
   * Will reset the notification whenever a navigation action occurs and only when the type of the
   * notifcation is TYPE_LOCAL
   */
  useEffect(() => {
    if (type !== TYPE_LOCAL || typeof onClose !== 'function') {
      return undefined;
    }

    const unlisten = history.listen(() => {
      onClose();
    });

    return () => {
      unlisten();
    };
  }, [history, type, title, onClose]);

  useEffect(() => {
    if (
      variant === VARIANT_ERROR ||
      type === TYPE_GLOBAL ||
      typeof onClose !== 'function'
    ) {
      return undefined;
    }

    if (hasFocus) {
      global.clearTimeout(onCloseTimeoutRef.current);
      global.clearTimeout(slideUpTimeoutRef.current);
    } else {
      const slideUpTimeoutId = global.setTimeout(() => {
        global.clearTimeout(slideUpTimeoutRef.current);

        setShouldHide(true);
      }, SLIDEUP_TIMEOUT);

      slideUpTimeoutRef.current = slideUpTimeoutId;

      const onCloseTimeoutId = global.setTimeout(() => {
        global.clearTimeout(onCloseTimeoutRef.current);

        onClose();
      }, ONCLOSE_TIMEOUT + SLIDEUP_TIMEOUT);

      onCloseTimeoutRef.current = onCloseTimeoutId;
    }

    return () => {
      global.clearTimeout(onCloseTimeoutRef.current);
      global.clearTimeout(slideUpTimeoutRef.current);
    };
  }, [hasFocus, onClose, type, variant]);

  const onCloseNotification = useCallback(() => {
    setShouldHide(true);

    const slideUpTimeoutId = global.setTimeout(() => {
      global.clearTimeout(slideUpTimeoutRef.current);

      /* istanbul ignore else */
      if (typeof onClose === 'function') {
        onClose();
      }
    }, ONCLOSE_TIMEOUT);

    slideUpTimeoutRef.current = slideUpTimeoutId;
  }, [onClose]);

  const transformClassName = tall ? 'fadeout' : 'slideup';

  return (
    <Wrapper
      className={`${className} ${shouldHide && transformClassName}`}
      data-testid="notification"
      onMouseEnter={() => setHasFocus(true)}
      onMouseLeave={() => setHasFocus(false)}
      top={tall ? SITE_HEADER_HEIGHT_TALL : SITE_HEADER_HEIGHT_SHORT}
      type={type}
      variant={variant}
    >
      <Row>
        <Column span={12}>
          <div>
            <Title hasMargin={Boolean(message)}>{title}</Title>
            {message && <Message>{message}</Message>}
          </div>
          <CloseButton
            alignTop={Boolean(message)}
            data-testid="notificationClose"
            icon={<Close />}
            onClick={onCloseNotification}
            size={20}
            type="button"
            variant="blank"
          />
        </Column>
      </Row>
    </Wrapper>
  );
};

Notification.defaultProps = {
  className: '',
  message: '',
  onClose: null,
  type: TYPE_LOCAL,
  variant: VARIANT_NOTICE,
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
