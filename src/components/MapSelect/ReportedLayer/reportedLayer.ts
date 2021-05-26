import BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer'
import L from 'leaflet'

import { ZOOM_MAX, ZOOM_MIN } from '../constants'
import IsReportedIcon from '!!file-loader!../../../shared/images/icon-reported-marker.svg' // `-marker` suffix ensures the svg is imported as url

const Y_OFFSET = 20
const X_OFFSET = 0

const icon = L.icon({
  iconUrl: IsReportedIcon as unknown as string,
  iconAnchor: [X_OFFSET, Y_OFFSET],
})

export const getIsReportedLayer = (fetchRequest: () => Promise<unknown>) =>
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
        }),
    }
  )
