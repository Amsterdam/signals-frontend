// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export const postMessage = (message: string) => {
  parent.window.postMessage(`signals/${message}`, '*')
}
