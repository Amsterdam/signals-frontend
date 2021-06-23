// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
const path = require('path')

const template = {}

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  const { inject } = require('../scripts/helpers/config')

  const indexFile = path.join(__dirname, '..', '..', 'src', 'index.html')
  const [indexContent] = inject([indexFile])

  template.templateContent = indexContent
} else {
  template.template = 'src/index.html'
}

module.exports = template
