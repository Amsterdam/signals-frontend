import React, { useCallback } from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Icon, themeSpacing } from '@amsterdam/asc-ui';
import { Close } from '@amsterdam/asc-assets';

import Button from 'components/Button';
import type { FeatureType, Item } from '../../types';

const StyledButton = styled(Button)`
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
`;

const List = styled.ul`
  padding: 0;
`;

const ListItem = styled.li`
  line-height: ${themeSpacing(4)};
  padding: ${themeSpacing(1, 0)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: initial;

  &:focus {
    outline-style: none;
  }
`;

const StyledIcon = styled(Icon)`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
`;

const StyledItemSpan = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${themeSpacing(2)};
`;

export interface ContainerEditListProps {
  selection: Item[];
  onRemove: (id: string) => void;
  featureTypes: FeatureType[];
  className?: string;
}

const ContainerEditList: FunctionComponent<ContainerEditListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
}) => {
  const getIconUrl = useCallback((type: string) => {
    const icon = featureTypes.find(feature => feature.typeValue === type)?.icon.iconSvg;

    if (!icon) return '';
    return `data:image/svg+xml;base64,${btoa(icon)}`;
  }, [featureTypes]);

  return (
    <List className={className} data-testid="containerEditList">
      {selection.map(({ id, description, type }) => (
        <ListItem data-testid={`containerEditListItem-${id}`} key={id} tabIndex={-1}>
          <StyledItemSpan>
            <StyledIcon size={40} iconUrl={getIconUrl(type)} />
            {`${description} - ${id}`}
          </StyledItemSpan>

          <StyledButton
            data-testid={`containerEditListRemove-${id}`}
            type="button"
            variant="blank"
            size={32}
            iconSize={12}
            icon={<Close />}
            onClick={() => {
              onRemove(id);
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ContainerEditList;
