import React, { useCallback, useContext, useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import type { MapOptions } from 'leaflet';

import { Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import { MapPanel, MapPanelContent, MapPanelDrawer, MapPanelProvider } from '@amsterdam/arm-core';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks';
import { Close } from '@amsterdam/asc-assets';
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext';

import Button from 'components/Button';
import Map from 'components/Map';
import MAP_OPTIONS from 'shared/services/configuration/map-options';

import ContainerSelectContext from 'signals/incident/components/form/ContainerSelect/context';
import type { ClickEventHandler, FeatureType } from 'signals/incident/components/form/ContainerSelect/types';
import LegendToggleButton from './components/LegendToggleButton';
import LegendPanel from './components/LegendPanel';
import ViewerContainer from './components/ViewerContainer';
import ContainerLayer from './components/WfsLayer/components/ContainerLayer';
import WfsLayer from './components/WfsLayer';
import ContainerList from '../ContainerList';

const MAP_PANEL_DRAWER_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '90%',
  [SnapPoint.Halfway]: '50%',
  [SnapPoint.Full]: '0',
};
const MAP_PANEL_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '30px',
  [SnapPoint.Halfway]: '400px',
  [SnapPoint.Full]: '100%',
};

const MapButton = styled(Button)`
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box; // Override box-sizing: content-box set by Leaflet
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

const StyledContainerList = styled(ContainerList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(8)} 0;
`;

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
  const [showDesktopVariant] = useMatchMedia({ minBreakpoint: 'tabletM' });
  const { Panel, panelVariant } = useMemo<{ Panel: FunctionComponent; panelVariant: Variant }>(
    () =>
      showDesktopVariant
        ? { Panel: MapPanel, panelVariant: 'panel' }
        : { Panel: MapPanelDrawer, panelVariant: 'drawer' },
    [showDesktopVariant]
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

  const [showLegendPanel, setShowLegendPanel] = useState(false);
  const [showSelectionPanel, setShowSelectionPanel] = useState(true);
  const [, setMap] = useState();

  const toggleLegend = () => {
    setShowLegendPanel(() => !showLegendPanel);
  };

  const handleLegendCloseButton = () => {
    setShowLegendPanel(false);
    setShowSelectionPanel(true);
  };

  const addContainer = useCallback<ClickEventHandler>(
    event => {
      event.preventDefault();

      // We use here a fixed list for now
      const selectedItems = SELECTED_ITEMS.map(({ id, type }) => {
        const { description }: Partial<FeatureType> =
          meta.featureTypes.find(({ typeValue }) => typeValue === type) ?? {};

        return {
          id,
          type,
          description,
        };
      });

      update(selectedItems);
    },
    [update, meta.featureTypes]
  );

  const removeContainer = useCallback<(itemId: string) => void>(
    itemId => {
      update(selection.filter(({ id }) => id !== itemId));
    }, [update, selection]
  );

  const mapWrapper = (
    <Wrapper data-testid="containerSelectSelector">
      <StyledMap hasZoomControls={showDesktopVariant} mapOptions={mapOptions} setInstance={setMap} events={{}}>
        <MapPanelProvider
          mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
          mapPanelDrawerSnapPositions={MAP_PANEL_DRAWER_SNAP_POSITIONS}
          variant={panelVariant}
          initialPosition={SnapPoint.Halfway}
        >
          <ViewerContainer
            topLeft={<LegendToggleButton onClick={toggleLegend} isRenderingLegendPanel={showLegendPanel} />}
            topRight={
              <MapButton data-testid="selectorClose" variant="blank" onClick={close} size={44} icon={<Close />} />
            }
          />
          <Panel data-testid={`panel${showDesktopVariant ? 'Desktop' : 'Mobile'}`}>
            {showSelectionPanel && (
              <MapPanelContent variant={panelVariant} title="Kies de container" data-testid="selectionPanel">
                <Paragraph>U kunt meer dan 1 keuze maken</Paragraph>
                <Button onClick={addContainer}>Containers toevoegen</Button>
                {selection.length ? (
                  <StyledContainerList selection={selection} onRemove={removeContainer} featureTypes={meta.featureTypes} />
                ) : (
                  <Paragraph as="h6">Maak een keuze op de kaart</Paragraph>
                )}
                <Button onClick={close} variant="primary">
                  Meld deze container{selection.length > 1 ? 's' : ''}
                </Button>
              </MapPanelContent>
            )}

            {showLegendPanel && (
              <LegendPanel
                onClose={handleLegendCloseButton}
                variant={panelVariant}
                title="Legenda"
                items={meta.featureTypes
                  .filter(({ label }) => label !== 'Onbekend') // Filter the unknown icon from the legend
                  .map(featureType => ({
                    label: featureType.label,
                    iconUrl: `data:image/svg+xml;base64,${btoa(featureType.icon.iconSvg)}`,
                    id: featureType.typeValue,
                  }))}
              />
            )}
          </Panel>
        </MapPanelProvider>

        <WfsLayer>
          <ContainerLayer featureTypes={meta.featureTypes} />
        </WfsLayer>
      </StyledMap>
    </Wrapper>
  );

  return ReactDOM.createPortal(mapWrapper, appHtmlElement);
};

export default Selector;
