// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Close } from '@amsterdam/asc-assets';

import IconList, { IconListItem } from 'components/IconList/IconList';
import Button from 'components/Button';

import type { FeatureType, Item } from '../types';

const StyledButton = styled(Button).attrs(() => ({
  type: 'button',
  variant: 'blank',
  size: 32,
  iconSize: 12,
}))`
  margin-left: 8px;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export interface ContainerListProps {
  selection: Item[];
  onRemove?: (id: string) => void;
  featureTypes: FeatureType[];
  className?: string;
}

const ContainerList: FunctionComponent<ContainerListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
}) => {
  const items = selection.map(({ id, type }) => {
    const { description, icon }: Partial<FeatureType> = featureTypes.find(({ typeValue }) => typeValue === type) ?? {};

    return {
      id,
      label: `${description}${id ? ` - ${id}` : ''}`,
      iconUrl: icon ? `data:image/svg+xml;base64,${btoa(icon.iconSvg)}` : '',
    };
  });

  return (
    <IconList data-testid="containerList" className={className}>
      {items.map(item =>
        <IconListItem key={item.id} id={`containerListItem-${item.id}`} iconUrl={item.iconUrl}>
          <ItemWrapper>
            {item.label}
            {onRemove &&
              <StyledButton
                data-testid={`containerListRemove-${item.id}`}
                aria-label="Verwijder"
                icon={<Close />}
                onClick={() => {
                  onRemove(item.id);
                }}
              />
            }
          </ItemWrapper>
        </IconListItem>
      )}
    </IconList>
  );
};

export default ContainerList;
