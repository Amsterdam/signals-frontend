// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect } from 'react'

import { DrawerState } from '../../../../../../../../components/DrawerOverlay'

export function useResetDrawerState(
  drawerState: DrawerState,
  setDrawerState: (state: DrawerState) => void,
  zoomLevel?: number
) {
  useEffect(() => {
    if (zoomLevel && zoomLevel < 13 && drawerState === DrawerState.Closed) {
      setDrawerState(DrawerState.Open)
    }
  }, [zoomLevel, setDrawerState, drawerState])
}
