import React, { useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import type { History } from 'types/history';
import HistoryList from 'components/HistoryList';
import { breakpoint, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import styled from 'styled-components';
import type { Theme } from 'types/theme';

const ButtonWrapper = styled.div`
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
  canView: boolean;
  parentUpdatedAt: string;
  history?: History[];
  className?: string;
}

const ChildIncidentHistory: FunctionComponent<ChildIncidentHistoryProps> = ({ canView, className, history, parentUpdatedAt }) => {
  const [showMore, setShowMore] = useState(false);

  const list = useMemo(() => {
    if (!history || history.length === 0) return;

    return showMore ? history : history.filter(entry => new Date(entry.when) > new Date(parentUpdatedAt));
  }, [history, parentUpdatedAt, showMore]);

  const hasMoreHistory = useMemo(() => {
    if (!history || !list) return false;

    return history.length > list.length || showMore;
  }, [history, list, showMore]);

  if (!canView) {
    return <p>Je hebt geen toestemming om meldingen in deze categorie te bekijken</p>;
  } else if (!list) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowMore(!showMore);
  };

  return (
    <div className={className} data-testid="childIncidentHistory">
      <HistoryList list={list} />
      <ButtonWrapper>
        {list.length === 0 && <StyledParagraph>Geen nieuwe wijzigingen</StyledParagraph>}
        <StyledLink
          href="#"
          variant="inline"
          onClick={handleClick}
        >
          {hasMoreHistory && (showMore ? 'Verberg geschiedenis' : 'Toon geschiedenis')}
        </StyledLink>
      </ButtonWrapper>
    </div>
  );
};

export default ChildIncidentHistory;
