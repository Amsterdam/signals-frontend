import React, { lazy, Suspense } from 'react';
import { Row, Column } from '@amsterdam/asc-ui';

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const OverviewMap = lazy(() =>
  import('../../../incident-management/containers/IncidentOverviewPage/components/OverviewMap')
);

export const IncidentOverviewContainer = () => (
  <Row>
    <Column span={12}>
      <Suspense>
        <OverviewMap />
      </Suspense>
    </Column>
  </Row>
);

export default IncidentOverviewContainer;
