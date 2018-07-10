import React from 'react';

import './style.scss';

const LoadingIndicator = () => (
  <div className="progress-wrapper">
    <div className="progress-indicator progress-red"></div>
    <div className="progress-txt">Laden...</div>
  </div>
);

export default LoadingIndicator;
