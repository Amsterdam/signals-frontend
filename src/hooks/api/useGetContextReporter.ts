/* istanbul ignore file */
import configuration from 'shared/services/configuration/configuration'
import type Reporter from 'types/api/reporter'

import type { QueryParameters } from './types'
import { useBuildGetter } from './useBuildGetter'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE = 1

const useGetContextReporter = () =>
  useBuildGetter<Reporter>(
    (
      id: number,
      { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE }: QueryParameters
    ) => {
      const searchParams = new URLSearchParams({
        page: `${page}`,
        page_size: `${pageSize}`,
      }).toString()

      const params = searchParams ? `?${searchParams}` : ''

      return [
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/reporter${params}`,
      ]
    }
  )

export default useGetContextReporter
