import React, { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import L from 'leaflet';
import MarkerClusterBase from 'components/MarkerCluster';

export interface Props {
  setLayerInstance: React.Dispatch<React.SetStateAction<L.GeoJSON | undefined>>;
}

const MarkerCluster: FunctionComponent<Props> = ({ setLayerInstance }) => {
  const clusterOptions = useMemo<L.MarkerClusterGroupOptions>(
    () => ({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      chunkedLoading: true,

      iconCreateFunction: /* istanbul ignore next */ cluster => {
        const childCount = cluster.getChildCount();

        return new L.DivIcon({
          html: `<div data-testid="markerClusterIcon"><span>${childCount}</span></div>`,
          className: 'marker-cluster',
          iconSize: new L.Point(40, 40),
        });
      },
    }),
    []
  );
  return <MarkerClusterBase clusterOptions={clusterOptions} setInstance={setLayerInstance} />;
};

export default MarkerCluster;
