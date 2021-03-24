import React, { Fragment, useCallback, useMemo } from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { MapPanelContent } from '@amsterdam/arm-core';
import { Paragraph, Button, themeColor, themeSpacing, Label, Input, Checkbox } from '@amsterdam/asc-ui';

import ContainerList from '../../ContainerList';

import type { FeatureType, Item } from '../../types';
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext';
import { UNREGISTERED_CONTAINER_TYPE } from '../../constants';

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

export interface SelectionPanelProps {
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
  const selectionOnMap = useMemo(
    () => selection.filter(container => container.type !== UNREGISTERED_CONTAINER_TYPE),
    [selection]
  );
  const unregisteredContainer = useMemo(
    () => selection.find(container => container.type === UNREGISTERED_CONTAINER_TYPE),
    [selection]
  );
  const hasUnregisteredContainer = useMemo(() => Boolean(unregisteredContainer), [unregisteredContainer]);

  const unregisteredFeature = useMemo(
    () => featureTypes.find(feature => feature.typeValue === UNREGISTERED_CONTAINER_TYPE),
    [featureTypes]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onClose();
      }
    },
    [onClose]
  );

  const removeContainer = useCallback(
    (itemId: string) => {
      onChange(selection.filter(({ id }) => id !== itemId));
    },
    [selection, onChange]
  );

  const removeContainerUnregistered = useCallback(() => {
    onChange(selectionOnMap);
  }, [selectionOnMap, onChange]);

  const updateUnregisteredContainer = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      /* istanbul ignore next */
      if (unregisteredContainer) {
        onChange([...selectionOnMap, { ...unregisteredContainer, id: event.currentTarget.value }]);
      }
    },
    [unregisteredContainer, onChange, selectionOnMap]
  );

  const addContainerUnregistered = useCallback(() => {
    /* istanbul ignore next */
    if (unregisteredFeature) {
      onChange([
        ...selectionOnMap,
        {
          id: '',
          type: unregisteredFeature.typeValue,
          description: unregisteredFeature.description,
        },
      ]);
    }
  }, [unregisteredFeature, onChange, selectionOnMap]);

  const toggleUnregisteredContainer = useCallback(
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      if (checked) {
        addContainerUnregistered();
      } else {
        removeContainerUnregistered();
      }
    },
    [addContainerUnregistered, removeContainerUnregistered]
  );

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

      {unregisteredFeature && (
        <div>
          <Checkbox id="unregisteredContainerCheckbox" checked={hasUnregisteredContainer} onChange={toggleUnregisteredContainer} />
          <Label htmlFor="unregisteredContainerCheckbox" label="De container staat niet op de kaart" />

          {unregisteredContainer && (
            <Fragment>
              <Label
                htmlFor="unregisteredContainerInput"
                label={
                  <Fragment>
                    <strong>Wat is het nummer van de container?</strong> (niet verplicht)
                  </Fragment>
                }
              />
              <Input id="unregisteredContainerInput" onSubmit={onClose} onKeyDown={handleKeyDown} onChange={updateUnregisteredContainer} value={unregisteredContainer.id} />
            </Fragment>
          )}
        </div>
      )}

      <StyledButton onClick={onClose} variant="primary">
        Meld deze container{selection.length > 1 ? 's' : ''}
      </StyledButton>
    </MapPanelContent>
  );
};

export default SelectionPanel;
