/**
 *
 * Asynchronously loads the component for IncidentWizard
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
