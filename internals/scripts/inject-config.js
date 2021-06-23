// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
const fs = require('fs')

const { inject } = require('./helpers/config')

const indexFile = '/usr/share/nginx/html/index.html'
const [indexContent] = inject([indexFile])

fs.writeFileSync(indexFile, indexContent)
