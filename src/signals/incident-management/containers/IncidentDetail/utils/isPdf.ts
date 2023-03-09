// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
export const isPdf = (url: string) => {
  return !!url.match(/[a-zA-Z0-9-_/]+\.pdf/)
}
