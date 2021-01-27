import React, { useCallback } from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { themeSpacing } from '@amsterdam/asc-ui';
import { Close } from '@amsterdam/asc-assets';

import Button from 'components/Button';
import type { FeatureType, Item } from '../../types';

const DEFAULT_ICON_SIZE = 40;
const REMOVE_BUTTON_SIZE = 32;
const REMOVE_ICON_SIZE = 12;
const NAME = 'containerEditList';

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

const StyledIcon = styled.span<{ url: string }>`
  display: inline-block;
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
  width: ${DEFAULT_ICON_SIZE}px;
  height: ${DEFAULT_ICON_SIZE}px;
  background-image: url(${({ url }) => url});
  background-size: cover;
`;

const StyledItemSpan = styled.span`
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
    <List className={className} data-testid={NAME}>
      {selection.map(({ id, description, type }) => (
        <ListItem data-testid={`${NAME}Item-${id}`} key={id} tabIndex={-1}>
          <StyledItemSpan>
            <StyledIcon url={getIconUrl(type)} />
            {description} - {id}
          </StyledItemSpan>

          <StyledButton
            data-testid={`${NAME}Remove-${id}`}
            type="button"
            variant="blank"
            size={REMOVE_BUTTON_SIZE}
            iconSize={REMOVE_ICON_SIZE}
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
