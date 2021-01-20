import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Paragraph, themeColor, ViewerContainer } from '@amsterdam/asc-ui';
import Button from 'components/Button';
import Map from 'components/Map';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';
import styled from 'styled-components';
import ContainerSelectContext from '../ContainerSelectContext';
import type { Item, ClickEventHandler, FeatureType } from '../types';
import type { MapOptions } from 'leaflet';

import ContainerLayer from '../ContainerLayer';
import WfsLayer from '../WfsLayer';

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

  .marker-cluster {
    color: ${themeColor('tint', 'level1')};
    background-color: ${themeColor('tint', 'level1')};
    box-shadow: 1px 1px 1px #666666;

    div {
      width: 32px;
      height: 32px;
      margin-top: 4px;
      margin-left: 4px;
      background-color: ${themeColor('primary')};
    }

    span {
      line-height: 34px;
    }
  }
`;

const unknownFeatureType: FeatureType = {
  description: 'De container staat niet op de kaart',
  icon: {
    iconSvg: unknown,
  },
  idField: 'id',
  typeField: 'type',
  typeValue: 'not-on-map',
};

// Temporary selction. Will be removes when selectionfunctionality will be implemented.
const SELECTED_ITEMS = [
  { id: 'PL734', type: 'Plastic' },
  { id: 'GLA00137', type: 'Glas' },
  { id: 'BR0234', type: 'Brood' },
  { id: 'PP0234', type: 'Papier' },
  { id: 'TEX0234', type: 'Textiel' },
  { id: 'GFT0234', type: 'GFT' },
  { id: 'RES0234', type: 'Rest' },
  { id: 'NOP0234', type: 'not-on-map' },
];

const Selector = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!;
  const { selection, location, meta, update, close } = useContext(ContainerSelectContext);
  const featureTypes = useMemo(() => [...meta.featureTypes, unknownFeatureType], [meta]);

  const mapOptions = useMemo<MapOptions>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => ({
      ...MAP_OPTIONS,
      center: location,
      zoomControl: false,
      minZoom: 10,
      maxZoom: 15,
      zoom: 14,
    }),

    [location]
  );

  const [, setMap] = useState();

  const addContainer = useCallback<ClickEventHandler>(
    event => {
      event.preventDefault();

      // We use here a fixed list for now
      const selectedItems: Item[] = SELECTED_ITEMS.map(({ id, type }) => {
        const { description, icon }: Partial<FeatureType> = featureTypes.find(({ typeValue }) => typeValue === type) ?? {};

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

  const removeContainer = useCallback<ClickEventHandler>(
    event => {
      event.preventDefault();
      update([]);
    },
    [update]
  );


  const mapWrapper =
    <Wrapper data-testid="containerSelectSelector">
      <StyledMap hasZoomControls mapOptions={mapOptions} setInstance={setMap} events={{}}>
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
        <WfsLayer>
          <ContainerLayer featureTypes={meta.featureTypes} />
        </WfsLayer>
      </StyledMap>
    </Wrapper>;
  return ReactDOM.createPortal(mapWrapper, appHtmlElement);
};

export default Selector;
