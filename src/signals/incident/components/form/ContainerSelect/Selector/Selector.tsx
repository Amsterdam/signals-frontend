import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import type { MapOptions } from 'leaflet';

import { Paragraph, themeColor } from '@amsterdam/asc-ui';
import { MapPanel, MapPanelDrawer, MapPanelLegendButton, MapPanelProvider } from '@amsterdam/arm-core';
import { Overlay, SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks';
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext';

import Button from 'components/Button';
import Map from 'components/Map';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';

import ContainerSelectContext from '../ContainerSelectContext';
import LegendPanel from '../LegendPanel';
import ViewerContainer from '../ViewerContainer';
import ContainerLayer from '../ContainerLayer';
import WfsLayer from '../WfsLayer';
import type { Item, ClickEventHandler, FeatureType } from '../types';

const MAP_PANEL_DRAWER_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '30px',
  [SnapPoint.Halfway]: '300px',
  [SnapPoint.Full]: '100%',
};
const MAP_PANEL_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '90%',
  [SnapPoint.Halfway]: '50%',
  [SnapPoint.Full]: '0',
};

const ButtonBar = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 401;

  & > div {
    display: flex;
    flex-direction: column;
  };
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
  label: 'Onbekend',
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
  const [showDesktopVariant] = useMatchMedia({ minBreakpoint: 'tabletM' });
  const { Panel, panelVariant } = useMemo<{ Panel: React.FC; panelVariant: Variant }>(
    () => showDesktopVariant
      ? { Panel: MapPanel, panelVariant: 'drawer' }
      : { Panel: MapPanelDrawer, panelVariant: 'panel' }
    , [showDesktopVariant]
  );

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

  const [currentOverlay, setCurrentOverlay] = useState<Overlay>(Overlay.None);
  console.log(currentOverlay);
  const bla = (x: any) => {
    console.log(x)
    setCurrentOverlay(x)

  }
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
      <StyledMap
        hasZoomControls={showDesktopVariant}
        mapOptions={mapOptions}
        setInstance={setMap}
        events={{}}
      >
        <MapPanelProvider
          mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
          mapPanelDrawerSnapPositions={MAP_PANEL_DRAWER_SNAP_POSITIONS}
          variant={panelVariant}
          initialPosition={SnapPoint.Closed}
        >
          <ViewerContainer
            legendButton={
              <MapPanelLegendButton
                showDesktopVariant={showDesktopVariant}
                currentOverlay={currentOverlay}
                setCurrentOverlay={setCurrentOverlay}
              />
            }
            bottomRight={
              <ButtonBar>
                <div>
                  <Button onClick={addContainer}>
                    Container toevoegen
                  </Button>
                  <Button onClick={removeContainer}>
                    Container verwijderen
                  </Button>
                  <Button onClick={close}>
                    Meld deze container/Sluiten
                  </Button>
                </div>
                <Paragraph as="h6">
                  Geselecteerd: {selection ? `[${selection.reduce((res, { id }) => `${res},${id}`, '')}]` : '<geen>'}
                </Paragraph>
              </ButtonBar>
            }
          />
          <Panel data-testid={`panel-${showDesktopVariant ? 'desktop' : 'mobile'}`}>
            <LegendPanel
              variant={panelVariant}
              title="Legenda"
              items={meta.featureTypes.map(featureType => ({
                label: featureType.label,
                iconUrl: `data:image/svg+xml;base64,${btoa(featureType.icon.iconSvg)}`,
                id: featureType.typeValue,
              }))}
            />
          </Panel>
        </MapPanelProvider>
        <WfsLayer>
          <ContainerLayer featureTypes={meta.featureTypes} />
        </WfsLayer>
      </StyledMap>
    </Wrapper>;

  return ReactDOM.createPortal(mapWrapper, appHtmlElement);
};

export default Selector;
