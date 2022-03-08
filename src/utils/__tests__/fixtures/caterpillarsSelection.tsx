import { FeatureStatus } from '../../../signals/incident/components/form/MapSelectors/types'

export const selection = [
  {
    id: 308777,
    type: 'Eikenboom',
    description: 'Eikenboom',
    location: {},
    label: 'Eikenboom - 308777',
  },
  {
    id: 308779,
    type: 'not-on-map',
    description: 'De boom staat niet op de kaart',
    location: {},
    label: 'Boom - 308779',
  },
  {
    id: 308778,
    type: 'Eikenboom',
    description: 'Eikenboom',
    status: FeatureStatus.REPORTED,
    location: {},
    label: 'Eikenboom - is gemeld - 308778',
  },
]
