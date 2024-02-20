// SPDX-License-Identifier: MPL-2.0

import { useEffect } from 'react'

// Copyright (C) 2022 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
export default function Step({
  render,
  id,
}: {
  render: () => JSX.Element | null
  id: string
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`/incident/${id}`)
    ;(window as any).dataLayer.push({
      event: 'interaction.component.virtualPageview',
      meta: {
        vpv_url: `/incident/${id}`, // TODO: moet de base url hier bij?
      },
    })
  }, [id])

  return <div id={id}>{render()}</div>
}
