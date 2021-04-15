// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor } from '@amsterdam/asc-ui';

import useEventEmitter from 'hooks/useEventEmitter';

export const HIGHLIGHT_TIMEOUT_INTERVAL = 1500;

const Wrapper = styled.div`
  &.animate {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: -3px;
      bottom: 0;
      right: 0;
      background-color: ${themeColor('support', 'focus')};
      opacity: 0;
      animation: highlight-fade-out ${HIGHLIGHT_TIMEOUT_INTERVAL}ms;
      z-index: -1;
    }
  }

  .children {
    position: relative;
  }

  @keyframes highlight-fade-out {
    0%,
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const Highlight = ({ className, children, type }) => {
  const { listenFor, unlisten } = useEventEmitter();
  const [animate, setAnimate] = useState(false);

  const animateHighlight = useCallback(
    event => {
      if (event.detail.type !== type) return undefined;

      setAnimate(true);

      const clear = () => {
        global.window.clearTimeout(animateTimeout);
      };

      const animateTimeout = global.window.setTimeout(clear, HIGHLIGHT_TIMEOUT_INTERVAL);

      return clear;
    },
    [type]
  );

  useEffect(() => {
    listenFor('highlight', animateHighlight);

    return () => {
      unlisten('highlight', animateHighlight);
    };
  }, [listenFor, animateHighlight, unlisten]);

  return (
    <Wrapper className={`${className}${animate ? ' animate' : ''}`} data-testid="highlight">
      {children}
    </Wrapper>
  );
};

Highlight.defaultProps = {
  className: '',
};

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default Highlight;
