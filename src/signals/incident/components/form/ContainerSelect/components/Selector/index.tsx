import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import type { MapOptions } from 'leaflet';

import { Paragraph, themeColor } from '@amsterdam/asc-ui';
import { MapPanel, MapPanelContent, MapPanelDrawer, MapPanelProvider } from '@amsterdam/arm-core';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks';
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext';

import Button from 'components/Button';
import Map from 'components/Map';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';

import ContainerSelectContext from 'signals/incident/components/form/ContainerSelect/context';
import type { Item, ClickEventHandler, FeatureType } from 'signals/incident/components/form/ContainerSelect/types';
import LegendToggleButton from './components/LegendToggleButton';
import LegendPanel from './components/LegendPanel';
import ViewerContainer from './components/ViewerContainer';
import ContainerLayer from './components/WfsLayer/components/ContainerLayer';
import WfsLayer from './components/WfsLayer';
import { Close } from '@amsterdam/asc-assets';
import ContainerList from '../ContainerList';

const MAP_PANEL_DRAWER_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '30px',
  [SnapPoint.Halfway]: '400px',
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
  z-index: 401;
`;

const StyledButton = styled(Button)`
  box-sizing: border-box;
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
    () =>
      showDesktopVariant
        ? { Panel: MapPanel, panelVariant: 'drawer' }
        : { Panel: MapPanelDrawer, panelVariant: 'panel' },
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
      const selectedItems: Item[] = SELECTED_ITEMS.map(({ id, type }) => {
        const { description, icon }: Partial<FeatureType> =
          featureTypes.find(({ typeValue }) => typeValue === type) ?? {};

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

  const mapWrapper = (
    <Wrapper data-testid="containerSelectSelector">
      <StyledMap hasZoomControls={showDesktopVariant} mapOptions={mapOptions} setInstance={setMap} events={{}}>
        <MapPanelProvider
          mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
          mapPanelDrawerSnapPositions={MAP_PANEL_DRAWER_SNAP_POSITIONS}
          variant={panelVariant}
          initialPosition={SnapPoint.Closed}
        >
          <ViewerContainer
            topLeft={<LegendToggleButton onClick={toggleLegend} isRenderingLegendPanel={showLegendPanel} />}
            topRight={
              <StyledButton data-testid="selector-close" variant="blank" onClick={close} size={44} icon={<Close />} />
            }
          />
          <Panel data-testid={`panel-${showDesktopVariant ? 'desktop' : 'mobile'}`}>
            {showSelectionPanel && (
              <MapPanelContent
                variant={panelVariant}
                title="Kies de container"
                subTitle="U kunt meer dan 1 keuze maken"
                data-testid="selection-panel"
              >
                <ButtonBar>
                  <StyledButton onClick={addContainer}>Containers toevoegen</StyledButton>
                  <StyledButton onClick={removeContainer}>Containers verwijderen</StyledButton>
                  {selection.length ? (
                    <ContainerList selection={selection} size={40} />
                  ) : (
                    <Paragraph as="h6">Maak een keuze op de kaart</Paragraph>
                  )}
                </ButtonBar>
                <ButtonBar>
                  <StyledButton onClick={close} variant="primary" disabled={selection.length === 0}>
                    Meld deze container{selection.length > 1 ? 's' : ''}
                  </StyledButton>
                </ButtonBar>
              </MapPanelContent>
            )}
            {showLegendPanel && (
              <LegendPanel
                onClose={handleLegendCloseButton}
                variant={panelVariant}
                title="Legenda"
                items={meta.featureTypes.map(featureType => ({
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
