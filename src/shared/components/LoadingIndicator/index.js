import React from 'react';

import './style.scss';

const LoadingIndicator = () => (
  <div className="progress-wrapper" data-testid="loadingIndicator">
    <div className="progress-indicator progress-red"></div>
    <div className="progress-txt">Laden...</div>
  </div>
);

export default LoadingIndicator;
