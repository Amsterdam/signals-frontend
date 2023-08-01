// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export default function onButtonPress(
  event: { key: string },
  callback: () => void
) {
  if ([' ', 'Enter'].includes(event.key)) {
    callback()
  }
}
