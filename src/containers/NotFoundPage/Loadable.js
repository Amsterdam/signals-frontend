import React from 'react';
import loadable from 'utils/loadable';
import LoadingIndicator from 'shared/components/LoadingIndicator';

export default loadable(() => import('./index'), {
  fallback: <LoadingIndicator />,
});
