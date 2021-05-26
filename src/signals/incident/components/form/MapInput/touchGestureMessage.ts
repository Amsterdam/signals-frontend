/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2021 Gemeente Amsterdam */
import L from 'leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)

// When mobile users scroll over the map with one finger, the leaflet-gesture-handling plugin renders a gray layer with a message (configured below)
export const TOUCH_GESTURE_MESSAGE_OPTION = {
  gestureHandling: true,
  gestureHandlingOptions: {
    text: {
      touch: 'Gebruik twee vingers om de kaart te verplaatsen',
      scroll: 'Gebruik Ctrl + scrollen om in- en uit te zoomen op de kaart',
      scrollMac: 'Gebruik \u2318 + scrollen om in en uit te zoomen op de kaart',
    },
  },
}
