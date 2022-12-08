// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Fragment, useMemo, useState } from 'react'
import type { FunctionComponent, MouseEvent } from 'react'

import { breakpoint, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import HistoryList from 'components/HistoryList'
import type { History } from 'types/history'
import type { Theme } from 'types/theme'

const gridValueStyle = css`
  margin: 0;
  grid-column-start: 1;

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column-start: 3;
  }
`

const Wrapper = styled.div`
  display: grid;
  row-gap: ${themeSpacing(4)};
  & {
    margin-bottom: ${themeSpacing(4)};
  }

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-template-columns: 2fr ${({ theme }: { theme: Theme }) =>
        theme.layouts.medium.gutter}px 4fr;
  }

  @media ${breakpoint('min-width', 'laptop')} {
    grid-template-columns: 3fr ${({ theme }: { theme: Theme }) =>
        theme.layouts.large.gutter}px 4fr;
  }
`

const StyledHistoryList = styled(HistoryList)`
  grid-column: 1 / 4;
`

const StyledLink = styled(Link)`
  ${gridValueStyle}
  font-size: inherit;

  :hover {
    cursor: pointer;
  }
`

const StyledParagraph = styled.p<{ light?: boolean }>`
  ${gridValueStyle}
  ${({ light, theme }) =>
    light &&
    `
    color: red;
    color: ${themeColor('tint', 'level5')({ theme: theme as Theme })}
  `}
`

interface ChildIncidentHistoryProps {
  /** Determines if user has permission to view child incident */
  canView: boolean
  /** Time of last update to parent incident */
  parentUpdatedAt: string
  history?: History[]
  className?: string
}

const ChildIncidentHistory: FunctionComponent<ChildIncidentHistoryProps> = ({
  canView,
  className,
  history = [],
  parentUpdatedAt,
}) => {
  const [showAllHistory, setShowAllhistory] = useState(false)

  /** Events that occurred after parentUpdatedAt */
  const recentHistory = useMemo(
    () =>
      history.filter(
        (entry) => new Date(entry.when) > new Date(parentUpdatedAt)
      ),
    [history, parentUpdatedAt]
  )

  const shownHistory = showAllHistory ? history : recentHistory
  const showToggle = history.length !== recentHistory.length

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setShowAllhistory(!showAllHistory)
  }

  return (
    <Wrapper className={className} data-testid="childIncidentHistory">
      {canView ? (
        <Fragment>
          {recentHistory.length === 0 && (
            <StyledParagraph light>Geen nieuwe wijzigingen</StyledParagraph>
          )}

          {shownHistory.length !== 0 && (
            <StyledHistoryList list={shownHistory} />
          )}

          {showToggle && (
            <StyledLink href="#" variant="inline" onClick={handleClick}>
              {showAllHistory ? 'Verberg geschiedenis' : 'Toon geschiedenis'}
            </StyledLink>
          )}
        </Fragment>
      ) : (
        <StyledParagraph>
          Je hebt geen toestemming om meldingen in deze categorie te bekijken
        </StyledParagraph>
      )}
    </Wrapper>
  )
}

export default ChildIncidentHistory
