import { useState } from 'react'

import { OverviewPage } from './components'
import { StandardTextsAdminProvider } from './provider'

export const StandardTextsAdmin = (props: any) => {
  const [page, setPage] = useState(1)

  return (
    <StandardTextsAdminProvider value={{ page, setPage }}>
      <OverviewPage {...props} />
    </StandardTextsAdminProvider>
  )
}
