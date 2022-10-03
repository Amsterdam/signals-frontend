// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Suspense } from 'react'
import type { ReactNode, ReactPortal } from 'react'

import ReactDOM from 'react-dom'

import { withAppContext } from 'test/utils'

ReactDOM.createPortal = (node) => node as ReactPortal

export const withPortal = (Component: ReactNode) =>
  withAppContext(
    <Suspense fallback={<div>Loading...</div>}>
      <div id="app">{Component}</div>
    </Suspense>
  )
