// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
export enum DrawerState {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export enum DeviceMode {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
}

export interface ModeProp {
  // prefixing mode with $ to prevent prop bleeding through to the DOM
  $mode: DeviceMode
}

export interface ControlledContentProps {
  onClose: () => void
}

export interface DisplayAddress {
  streetName: string
  postalCode: string
}
