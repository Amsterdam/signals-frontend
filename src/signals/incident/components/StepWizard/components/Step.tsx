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
    // Do not log the 'Opslaan' page
    id !== 'incident/opslaan' &&
      (window as any).dataLayer?.push({
        event: 'interaction.component.virtualPageview',
        meta: {
          vpv_url: `/${id}/`,
        },
      })
  }, [id])

  return <div id={id}>{render()}</div>
}
