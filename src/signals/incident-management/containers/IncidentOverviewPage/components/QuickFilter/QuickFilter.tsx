import { FunctionComponent } from 'react'
import type { Filter } from 'shared/types/filter'

import { PageHeaderItem, StyledLink, StyledParagraph } from '../../styled'

interface QuickFilterProps {
  filters: Filter[]
  setFilter: (selectedFilter: Filter) => void
}

const QuickFilter: FunctionComponent<QuickFilterProps> = ({
  filters,
  setFilter,
}) =>
  filters.length > 0 ? (
    <PageHeaderItem>
      <StyledParagraph>
        <strong>Mijn filters:</strong>
      </StyledParagraph>

      {filters.map((filter) => (
        <StyledLink
          role="button"
          onClick={() => setFilter(filter)}
          key={filter.id}
          variant="inline"
        >
          {filter.name}
        </StyledLink>
      ))}
    </PageHeaderItem>
  ) : null

export default QuickFilter
