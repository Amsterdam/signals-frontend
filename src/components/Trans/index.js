import React from 'react';
import { Trans } from 'react-i18next';

/**
 * Component that wraps the Trans component so that HTML elements inside a translation string won't break CSS grid or
 * flexbox style rules.
 */

/* eslint-disable jsx-a11y/anchor-has-content,jsx-a11y/anchor-is-valid */

const TransComponent = props => (
  <span>
    <Trans {...props} components={{ a: <a />, strong: <strong />, em: <em />, span: <span /> }} />
  </span>
);

export default TransComponent;
