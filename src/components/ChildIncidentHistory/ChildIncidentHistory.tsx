import React, { useEffect, useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import { useFetch } from 'hooks';
import configuration from 'shared/services/configuration/configuration';
import type { History } from 'types/history';
import HistoryList from 'components/HistoryList';
import { Button } from '@amsterdam/asc-ui';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  align-self: end;
`;

interface ChildIncidentHistoryProps {
  id: string;
  canView: boolean;
  className?: string;
}

const ChildIncidentHistory: FunctionComponent<ChildIncidentHistoryProps> = ({ id, canView, className }) => {
  const { get, data } = useFetch<History[]>();
  const [showMore, setShowMore] = useState(false);
  const list = useMemo(() => {
    if (data) {
      return showMore ? data : [data[0]];
    }
  }, [data, showMore]);

  const Link = useMemo(() => {
    if (!list || list.length < 1) return null;

    return () => (
      <StyledButton
        type="button"
        variant="textButton"
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        {showMore ? 'minder' : 'meer'}
      </StyledButton>
    );
  }, [list, showMore, setShowMore]);

  useEffect(() => {
    if (canView) {
      void get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`);
    }
  }, [id, get, canView]);

  if (!canView) {
    return <p>Je hebt geen toestemming om meldingen in deze categorie te bekijken</p>;
  }

  if (!list) return null;

  return (
    <Wrapper className={className}>
      <HistoryList list={list} />
      {Link ? <Link /> : null}
    </Wrapper>
  );
};

export default ChildIncidentHistory;
