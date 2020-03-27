import React, { useState, useEffect, useLayoutEffect } from 'react';
import { themeColor } from '@datapunt/asc-ui';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  &.active {
    position: relative;
    z-index: 1;

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: -3px;
      bottom: 0;
      right: 0;
      background-color: ${themeColor('support', 'focus')};
      opacity: 0;
      animation: highlight-fade-out 1.5s;
      z-index: 2;
    }
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

const Container = styled.div`
  position: relative;
  z-index: 3;
`;

export const HIGHLIGHT_TIMEOUT_INTERVAL = 3000;

const Highlight = ({ children, className, subscribeTo, valueChanged }) => {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    setShow(true);

    const timer = global.setTimeout(() => {
      setShow(false);
    }, HIGHLIGHT_TIMEOUT_INTERVAL);

    return () => {
      global.clearTimeout(timer);
    };
  }, [subscribeTo]);

  return (
    <Wrapper className={`${className} ${show && valueChanged ? 'active' : ''}`} data-testid="highlight">
      <Container>{children}</Container>
    </Wrapper>
  );
};

Highlight.defaultProps = {
  className: '',
  valueChanged: false,
};

Highlight.propTypes = {
  className: PropTypes.string,
  subscribeTo: PropTypes.any,
  valueChanged: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

export default Highlight;
