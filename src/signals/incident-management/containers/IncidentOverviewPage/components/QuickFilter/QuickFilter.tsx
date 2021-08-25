import { FunctionComponent } from 'react'
import type { Filter } from 'shared/types/filter'

import { StyledPageHeaderItem, StyledLink, StyledParagraph } from '../../styled'

interface QuickFilterProps {
  filters: Filter[]
  setFilter: (selectedFilter: Filter) => void
}

const QuickFilter: FunctionComponent<QuickFilterProps> = ({
  filters,
  setFilter,
}) =>
  filters.length > 0 ? (
    <StyledPageHeaderItem>
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
    </StyledPageHeaderItem>
  ) : null

export default QuickFilter
