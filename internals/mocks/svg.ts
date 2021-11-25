// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { createElement } from 'react'
import type { FunctionComponent, SVGProps } from 'react'

const SvgMock: FunctionComponent<SVGProps<SVGSVGElement>> = (props) =>
  createElement('svg', props)

export default SvgMock
