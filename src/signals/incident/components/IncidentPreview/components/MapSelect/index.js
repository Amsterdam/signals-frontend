import configuration from 'shared/services/configuration/configuration'

import MapSelectGenericPreview from '../MapSelectGeneric'
import MapSelectPreview from './MapSelect'

export default configuration.featureFlags.useMapSelectGeneric
  ? MapSelectGenericPreview
  : MapSelectPreview
