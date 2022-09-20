// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
export const postMessage = (message: string) => {
  parent.window.postMessage(`signals/${message}`, '*')
}
