import { Paragraph, ViewerContainer } from '@amsterdam/asc-ui';
import Button from 'components/Button';
import Map from 'components/Map';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';
import styled from 'styled-components';
import ContainerSelectContext from '../context';
import type { Item, ClickEvent, FeatureType } from '../types';
import type { MapOptions } from 'leaflet';

const ButtonBar = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  z-index: 401;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
`;

const unknownFeatureType: FeatureType = {
  description: 'De container staat niet op de kaart',
  icon: {
    iconSvg: unknown,
  },
  typeValue: 'not-on-map',
};

// Temporary selction. Will be removes when selectionfunctionality will be implemented.
const SELECTED_ITEMS = [
  { id: 'PL734', type: 'plastic' },
  { id: 'GLA00137', type: 'glas' },
  { id: 'BR0234', type: 'brood' },
  { id: 'PP0234', type: 'papier' },
  { id: 'TEX0234', type: 'textiel' },
  { id: 'GFT0234', type: 'gft' },
  { id: 'RES0234', type: 'restafval' },
  { id: 'NOP0234', type: 'not-on-map' },
];

const Selector = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!;

  const { selection, location, meta, update, close } = useContext(ContainerSelectContext);
  const featureTypes = useMemo(() => meta && [...meta.featureTypes, unknownFeatureType] || [], [meta]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mapOptions: MapOptions = {
    ...MAP_OPTIONS,
    center: location?.reverse(),
    zoomControl: false,
    minZoom: 10,
    maxZoom: 15,
    zoom: 14,
  };

  const [, setMap] = useState();

  const addContainer = useCallback<ClickEvent>(
    event => {
      event.preventDefault();

      // We use here a fixed list for now
      const selectedItems: Item[] = SELECTED_ITEMS.map(({ id, type }) => {
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

  return ReactDOM.createPortal(
    <Wrapper>
      <StyledMap data-testid="map" hasZoomControls mapOptions={mapOptions} setInstance={setMap}>
        <ViewerContainer
          topLeft={
            <ButtonBar>
              <div>
                <Button onClick={addContainer}>Container toevoegen</Button>
                <Button onClick={removeContainer}>Container verwijderen</Button>
                <Button onClick={close}>Meld deze container/Sluiten</Button>
              </div>
              <Paragraph as="h6">
                Geselecteerd: {selection ? `[${selection.reduce((res, { id }) => `${res},${id}`, '')}]` : '<geen>'}
              </Paragraph>
            </ButtonBar>
          }
        />
      </StyledMap>
    </Wrapper>,
    appHtmlElement
  );
};

export default Selector;
