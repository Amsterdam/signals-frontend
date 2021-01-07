import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import { Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import { unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';
import ContainerSelectContext from '../context';
import type { Item, ClickEvent, FeatureType } from '../types';

const Wrapper = styled.div`
  position: relative;
  border: 1px dotted ${themeColor('tint', 'level3')};
  height: ${themeSpacing(40)};
`;

const ButtonBar = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
`;

const unknownFeatureType: FeatureType = {
  description: 'De container staat niet op de kaart',
  icon: {
    iconSvg: unknown,
  },
  typeValue: 'not-on-map',
};


const Selector = () => {
  const { selection, meta, update, close } = useContext(ContainerSelectContext);
  const featureTypes = useMemo(() => meta && [...meta.featureTypes, unknownFeatureType] || [], [meta]);

  const addContainer = useCallback<ClickEvent>(
    event => {
      event.preventDefault();

      // We use here a fixed list for now
      const selectedItems: Item[] = [
        { id: 'PL734', type: 'plastic' },
        { id: 'GLA00137', type: 'glas' },
        { id: 'BR0234', type: 'brood' },
        { id: 'PP0234', type: 'papier' },
        { id: 'TEX0234', type: 'textiel' },
        { id: 'GFT0234', type: 'gft' },
        { id: 'RES0234', type: 'restafval' },
        { id: 'RES0234', type: 'not-on-map' },
      ].map(({ id, type }) => {
        const found: Partial<FeatureType> = featureTypes.find(({ typeValue }) => typeValue === type) ?? {};
        const { description, icon } = found;

        return {
          id,
          type,
          description,
          iconUrl: icon ? `data:image/svg+xml;base64,${btoa(icon.iconSvg)}` : '',
        };
      });

      update(selectedItems);
    },
    [update, featureTypes]
  );

  const removeContainer = useCallback<ClickEvent>(
    event => {
      event.preventDefault();
      update(null);
    },
    [update]
  );

  return (
    <Wrapper data-testid="containerSelectSelector">
      <ButtonBar>
        <Button onClick={addContainer}>Container toevoegen</Button>
        <Button onClick={removeContainer}>Container verwijderen</Button>
        <Button onClick={close}>Meld deze container/Sluiten</Button>
      </ButtonBar>
      <Paragraph as="h6">Geselecteerd: {selection ? `[${selection.reduce((res, { id }) => `${res},${id}`, '')}]` : '<geen>'}</Paragraph>
    </Wrapper>
  );
};

export default Selector;
