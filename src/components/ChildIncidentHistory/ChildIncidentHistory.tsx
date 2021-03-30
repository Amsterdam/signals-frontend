import React, { useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import type { History } from 'types/history';
import HistoryList from 'components/HistoryList';
import { breakpoint, Link, themeSpacing } from '@amsterdam/asc-ui';
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

interface ChildIncidentHistoryProps {
  canView: boolean;
  history?: History[];
  className?: string;
}

const ChildIncidentHistory: FunctionComponent<ChildIncidentHistoryProps> = ({ canView, className, history }) => {
  const [showMore, setShowMore] = useState(false);
  const list = useMemo(() => {
    if (!history || history.length === 0) return;

    return showMore ? history : [history[0]];
  }, [history, showMore]);

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
    <div className={className}>
      <HistoryList list={list} />
      <ButtonWrapper>
        <StyledLink
          href="#"
          variant="inline"
          onClick={handleClick}
        >
          {showMore ? 'Verberg geschiedenis' : 'Toon geschiedenis'}
        </StyledLink>
      </ButtonWrapper>
    </div>
  );
};

export default ChildIncidentHistory;
