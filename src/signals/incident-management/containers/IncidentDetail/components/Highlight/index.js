import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { themeColor } from '@datapunt/asc-ui';

export const HIGHLIGHT_TIMEOUT_INTERVAL = 1500;

const Wrapper = styled.div`
  ${({ animate }) =>
    animate &&
    css`
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
    `}

  .children {
    position: relative;
    // z-index: 20;
  }

  @keyframes highlight-fade-out {
    from {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const Highlight = ({ className, children, valueChanged }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!valueChanged) return undefined;

    setAnimate(true);

    const clear = () => {
      setAnimate(false);
      global.window.clearTimeout(animateTimeout);
    };

    const animateTimeout = global.window.setTimeout(clear, HIGHLIGHT_TIMEOUT_INTERVAL);

    return () => clear;
  }, [valueChanged]);

  return (
    <Wrapper className={className} animate={animate} data-testid="highlight">
      {children}
    </Wrapper>
  );
};

Highlight.defaultProps = {
  className: '',
  valueChanged: false,
};

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  valueChanged: PropTypes.bool,
};

export default Highlight;
