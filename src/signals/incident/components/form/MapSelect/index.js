// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import MapSelectGeneric from '../MapSelectGeneric'
import MapSelect from './MapSelect'

export default configuration.featureFlags.useMapSelectGeneric
  ? MapSelectGeneric
  : MapSelect
