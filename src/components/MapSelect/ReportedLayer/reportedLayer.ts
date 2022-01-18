import BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer'
import L from 'leaflet'

import { ZOOM_MAX, ZOOM_MIN } from '../constants'

const Y_OFFSET = 20
const X_OFFSET = 0

const icon = L.icon({
  iconUrl: '/assets/images/icon-reported-marker.svg',
  iconAnchor: [X_OFFSET, Y_OFFSET],
})

export const getIsReportedLayer = (
  fetchRequest: () => Promise<unknown>,
  filter: (feature: unknown) => boolean
) =>
  BboxGeojsonLayer(
    {
      fetchRequest,
    },
    {
      zoomMin: ZOOM_MIN,
      zoomMax: ZOOM_MAX,
      pointToLayer: (_feature: unknown, latlong: [number, number]) =>
        L.marker(latlong, {
          icon,
          alt: 'Dit object heeft een openstaande melding',
          zIndexOffset: 1,
        }),
      filter,
    }
  )
