import React from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext';

import { MapPanelContent } from '@amsterdam/arm-core';
import { Paragraph, Button, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import ContainerList from '../../ContainerList';
import type { ClickEventHandler, FeatureType, Item } from '../../types';

const StyledContainerList = styled(ContainerList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(4)} 0;
`;

const StyledParagraph = styled(Paragraph)`
  margin-bottom: 0;
  font-size: 16px;
  opacity: 0.6;
`;

const EmptySelectionWrapper = styled.div`
  background-color: ${themeColor('tint', 'level2')};
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${themeSpacing(4)} 0;
`;

interface SelectionPanelProps {
  onRemove: (id: string) => void;
  onClose: ClickEventHandler;
  variant: Variant;
  selection: Item[];
  featureTypes: FeatureType[];
}

const SelectionPanel: FunctionComponent<SelectionPanelProps> = ({
  onRemove,
  onClose,
  variant,
  selection,
  featureTypes,
}) => (
  <MapPanelContent variant={variant} title="Kies de container" data-testid="selectionPanel">
    <Paragraph>U kunt meer dan 1 keuze maken</Paragraph>
    {selection.length ? (
      <StyledContainerList selection={selection} onRemove={onRemove} featureTypes={featureTypes} />
    ) : (
      <EmptySelectionWrapper>
        <StyledParagraph>Maak een keuze op de kaart</StyledParagraph>
      </EmptySelectionWrapper>
    )}
    <Button onClick={onClose} variant="primary">
      Meld deze container{selection.length > 1 ? 's' : ''}
    </Button>
  </MapPanelContent>
);

export default SelectionPanel;
