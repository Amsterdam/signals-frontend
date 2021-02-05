import React, { Fragment } from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { MapPanelContent } from '@amsterdam/arm-core';
import { Paragraph, Button, themeColor, themeSpacing, Label, Input, Checkbox } from '@amsterdam/asc-ui';

import ContainerList from '../../ContainerList';

import type { FeatureType, Item } from '../../types';
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext';
import { CONTAINER_NOT_ON_MAP_TYPE_NAME } from 'signals/incident/definitions/wizard-step-2-vulaan/afval.constants';

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

const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
`;

interface SelectionPanelProps {
  onChange: (items: Item[]) => void;
  onClose: () => void;
  variant: Variant;
  selection: Item[];
  featureTypes: FeatureType[];
}

const SelectionPanel: FunctionComponent<SelectionPanelProps> = ({
  onChange,
  onClose,
  variant,
  selection,
  featureTypes,
}) => {
  const selectionOnMap = selection.filter(container => container.type !== CONTAINER_NOT_ON_MAP_TYPE_NAME);
  const notOnMapContainer = selection.find(container => container.type === CONTAINER_NOT_ON_MAP_TYPE_NAME);
  const hasNotOnMapContainer = Boolean(notOnMapContainer);

  const removeContainer = (itemId: string) => {
    onChange(selection.filter(({ id }) => id !== itemId));
  };

  const removeContainerNotOnMap = () => {
    onChange(selection.filter(container => container.type !== CONTAINER_NOT_ON_MAP_TYPE_NAME));
  };

  const updateNotOnMapContainer = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      selection.map(container =>
        container.type === CONTAINER_NOT_ON_MAP_TYPE_NAME
          ? {
            ...container,
            id: event.currentTarget.value,
          }
          : container
      )
    );
  };

  const addContainerNotOnMap = () => {
    const { description } =
      featureTypes.find(feature => feature.typeValue === CONTAINER_NOT_ON_MAP_TYPE_NAME) ?? ({} as FeatureType);

    onChange([
      ...selection,
      {
        id: '',
        type: CONTAINER_NOT_ON_MAP_TYPE_NAME,
        description,
      },
    ]);
  };

  const toggleNotOnMapContainer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (checked) {
      addContainerNotOnMap();
    } else {
      removeContainerNotOnMap();
    }
  };

  return (
    <MapPanelContent variant={variant} title="Kies de container" data-testid="selectionPanel">
      <Paragraph>U kunt meer dan 1 keuze maken</Paragraph>

      {selectionOnMap.length ? (
        <StyledContainerList selection={selectionOnMap} onRemove={removeContainer} featureTypes={featureTypes} />
      ) : (
        <EmptySelectionWrapper>
          <StyledParagraph>Maak een keuze op de kaart</StyledParagraph>
        </EmptySelectionWrapper>
      )}

      <form>
        <Checkbox id="notOnMapCheckbox" checked={hasNotOnMapContainer} onChange={toggleNotOnMapContainer} />
        <Label htmlFor="notOnMapCheckbox" label="De container staat niet op de kaart" />

        {hasNotOnMapContainer && (
          <Fragment>
            <Label
              htmlFor="notOnMapInput"
              label={
                <Fragment>
                  <strong>Wat is het nummer van de container?</strong> (Optioneel)
                </Fragment>
              }
            />
            <Input id="notOnMapInput" onChange={updateNotOnMapContainer} value={notOnMapContainer?.id} />
          </Fragment>
        )}

        <StyledButton onClick={onClose} variant="primary">
          Meld deze container{selection.length > 1 ? 's' : ''}
        </StyledButton>
      </form>
    </MapPanelContent>
  );
};

export default SelectionPanel;
