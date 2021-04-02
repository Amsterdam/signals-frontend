// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React, { useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import type { History } from 'types/history';
import HistoryList from 'components/HistoryList';
import { breakpoint, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import styled from 'styled-components';
import type { Theme } from 'types/theme';

const Wrapper = styled.div`
  display: grid;
  margin-bottom: ${themeSpacing(4)};
  && {
    margin-top: 0;
  }

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-template-columns: 2fr ${({ theme }: { theme: Theme }) => theme.layouts.medium.gutter}px 4fr;
  }

  @media ${breakpoint('min-width', 'laptop')} {
    grid-template-columns: 3fr ${({ theme }: { theme: Theme }) => theme.layouts.large.gutter}px 4fr;
  }
`;

const StyledHistoryList = styled(HistoryList)`
  grid-column: 1 / 4;
`;

const StyledLink = styled(Link)`
  grid-column-start: 1;
  font-size: 16px;
  :hover {
    cursor: pointer;
  }

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column-start: 3;
  }
`;

const StyledParagraph = styled.p`
  grid-column-start: 1;
  margin-top: 0;

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column-start: 3;
  }

  & {
    color: ${themeColor('tint', 'level5')};
  }
`;

interface ChildIncidentHistoryProps {
  /** Determines if user has permission to view child incident */
  canView: boolean;
  /** Time of last update to parent incident */
  parentUpdatedAt: string;
  history?: History[];
  className?: string;
}

const ChildIncidentHistory: FunctionComponent<ChildIncidentHistoryProps> = ({
  canView,
  className,
  history = [],
  parentUpdatedAt,
}) => {
  const [showAllHistory, setShowAllhistory] = useState(false);

  /** Events that occurred after parentUpdatedAt */
  const recentHistory = useMemo(() => history.filter(entry => new Date(entry.when) > new Date(parentUpdatedAt)), [
    history,
    parentUpdatedAt,
  ]);

  const shownHistory = showAllHistory ? history : recentHistory;
  const showToggle = history.length !== recentHistory.length;

  if (!canView) {
    return <p>Je hebt geen toestemming om meldingen in deze categorie te bekijken</p>;
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowAllhistory(!showAllHistory);
  };

  return (
    <Wrapper className={className} data-testid="childIncidentHistory">
      {recentHistory.length === 0 && <StyledParagraph>Geen nieuwe wijzigingen</StyledParagraph>}

      <StyledHistoryList list={shownHistory} />

      {showToggle && (
        <StyledLink href="#" variant="inline" onClick={handleClick}>
          {showAllHistory ? 'Verberg geschiedenis' : 'Toon geschiedenis'}
        </StyledLink>
      )}
    </Wrapper>
  );
};

export default ChildIncidentHistory;
