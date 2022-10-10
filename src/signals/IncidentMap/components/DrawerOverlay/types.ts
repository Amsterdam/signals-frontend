// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type {DeviceMode} from "../../types/device-mode";

export enum DrawerState {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export interface ModeProp {
  // prefixing mode with $ to prevent prop bleeding through to the DOM
  $mode: DeviceMode
}
