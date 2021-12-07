// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
declare module '*.svg?url' {
  const url: string
  export default url
}
declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react'
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>

  export default ReactComponent
}

declare module '*.jpg'

declare module '*.png'

declare module '@datapunt/leaflet-geojson-bbox-layer'
