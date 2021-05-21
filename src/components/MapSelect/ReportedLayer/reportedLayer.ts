import BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer'
import L from 'leaflet'

import { ZOOM_MAX, ZOOM_MIN } from '../constants'
import IsReportedIcon from '!!file-loader!../../../shared/images/icon-reported-marker.svg' // `-marker` suffix ensures the svg is imported as url

const IS_REPORTED_KEY = 'meldingstatus' // Hardcoded property specific to the Amsterdam verlichting/klokken GeoJSON data
const Y_OFFSET = 20
const X_OFFSET = 0

interface GeoJSON {
  properties: {
    [IS_REPORTED_KEY]: boolean
  }
}

const icon = L.icon({
  iconUrl: IsReportedIcon as unknown as string,
  iconAnchor: [X_OFFSET, Y_OFFSET],
})

export const getIsReportedLayer = (fetchRequest: () => Promise<GeoJSON>) => {
  return BboxGeojsonLayer(
    {
      fetchRequest,
    },
    {
      zoomMin: ZOOM_MIN,
      zoomMax: ZOOM_MAX,
      pointToLayer: (feature: GeoJSON, latlong: [number, number]) => {
        if (feature.properties[IS_REPORTED_KEY]) {
          return L.marker(latlong, {
            icon,
            alt: 'Dit object heeft een openstaande melding',
          })
        }
      },
    }
  )
}
