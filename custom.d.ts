// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react'
  export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>

  const url: string
  export default url
}

declare module '*.jpg'

declare module '*.png'

declare module '@datapunt/leaflet-geojson-bbox-layer'
