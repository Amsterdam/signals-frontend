import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import MapSelect from '.';

const jsonResponse = {
  type: 'FeatureCollection',
  name: 'verlichting',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: [
    {
      type: 'Feature',
      properties: { ogc_fid: '150', type_id: '2', type_name: 'Overspanning', objectnummer: '000290' },
      geometry: { type: 'Point', coordinates: [4.896391, 52.371616] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '151', type_id: '2', type_name: 'Overspanning', objectnummer: '000292' },
      geometry: { type: 'Point', coordinates: [4.897471, 52.371364] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '888', type_id: '5', type_name: 'Grachtmast', objectnummer: '001302' },
      geometry: { type: 'Point', coordinates: [4.895146, 52.37142] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1025', type_id: '5', type_name: 'Grachtmast', objectnummer: '001500' },
      geometry: { type: 'Point', coordinates: [4.897003, 52.371149] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1816', type_id: '5', type_name: 'Grachtmast', objectnummer: '002595' },
      geometry: { type: 'Point', coordinates: [4.895294, 52.371577] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1817', type_id: '5', type_name: 'Grachtmast', objectnummer: '002596' },
      geometry: { type: 'Point', coordinates: [4.895003, 52.371277] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1822', type_id: '5', type_name: 'Grachtmast', objectnummer: '002603' },
      geometry: { type: 'Point', coordinates: [4.894682, 52.370949] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1845', type_id: '5', type_name: 'Grachtmast', objectnummer: '002635' },
      geometry: { type: 'Point', coordinates: [4.896506, 52.370984] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1872', type_id: '5', type_name: 'Grachtmast', objectnummer: '002682' },
      geometry: { type: 'Point', coordinates: [4.896542, 52.371274] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1881', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '002697' },
      geometry: { type: 'Point', coordinates: [4.895632, 52.371403] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1882', type_id: '5', type_name: 'Grachtmast', objectnummer: '147329' },
      geometry: { type: 'Point', coordinates: [4.895565, 52.371467] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '3433', type_id: '5', type_name: 'Grachtmast', objectnummer: '004808' },
      geometry: { type: 'Point', coordinates: [4.896662, 52.371379] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '3529', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '004952' },
      geometry: { type: 'Point', coordinates: [4.896393, 52.37122] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '5806', type_id: '5', type_name: 'Grachtmast', objectnummer: '007856' },
      geometry: { type: 'Point', coordinates: [4.895316, 52.371238] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '6575', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '008895' },
      geometry: { type: 'Point', coordinates: [4.895856, 52.37135] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '10062', type_id: '5', type_name: 'Grachtmast', objectnummer: '013232' },
      geometry: { type: 'Point', coordinates: [4.896419, 52.371142] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '10176', type_id: '5', type_name: 'Grachtmast', objectnummer: '013377' },
      geometry: { type: 'Point', coordinates: [4.894867, 52.371142] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '13472', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '017467' },
      geometry: { type: 'Point', coordinates: [4.894822, 52.371301] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '15390', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '019815' },
      geometry: { type: 'Point', coordinates: [4.895182, 52.371585] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '15391', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '019816' },
      geometry: { type: 'Point', coordinates: [4.894711, 52.371702] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '16076', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '020707' },
      geometry: { type: 'Point', coordinates: [4.896141, 52.371281] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '20563', type_id: '5', type_name: 'Grachtmast', objectnummer: '026110' },
      geometry: { type: 'Point', coordinates: [4.896201, 52.370894] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '27600', type_id: '5', type_name: 'Grachtmast', objectnummer: '147328' },
      geometry: { type: 'Point', coordinates: [4.895728, 52.371596] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '49601', type_id: '2', type_name: 'Overspanning', objectnummer: '066529' },
      geometry: { type: 'Point', coordinates: [4.896813, 52.371603] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '52005', type_id: '2', type_name: 'Overspanning', objectnummer: '069584' },
      geometry: { type: 'Point', coordinates: [4.897292, 52.371409] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '59136', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '078431' },
      geometry: { type: 'Point', coordinates: [4.894952, 52.371646] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '64770', type_id: '5', type_name: 'Grachtmast', objectnummer: '087837' },
      geometry: { type: 'Point', coordinates: [4.896661, 52.37115] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '64771', type_id: '5', type_name: 'Grachtmast', objectnummer: '087838' },
      geometry: { type: 'Point', coordinates: [4.896789, 52.371284] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '64794', type_id: '5', type_name: 'Grachtmast', objectnummer: '087893' },
      geometry: { type: 'Point', coordinates: [4.896914, 52.371426] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '70662', type_id: '5', type_name: 'Grachtmast', objectnummer: '096077' },
      geometry: { type: 'Point', coordinates: [4.896311, 52.371017] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '70663', type_id: '5', type_name: 'Grachtmast', objectnummer: '096079' },
      geometry: { type: 'Point', coordinates: [4.895408, 52.371335] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '70664', type_id: '5', type_name: 'Grachtmast', objectnummer: '147327' },
      geometry: { type: 'Point', coordinates: [4.895848, 52.371691] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '88565', type_id: '5', type_name: 'Grachtmast', objectnummer: '130951' },
      geometry: { type: 'Point', coordinates: [4.896964, 52.371658] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '92824', type_id: '5', type_name: 'Grachtmast', objectnummer: '002693' },
      geometry: { type: 'Point', coordinates: [4.895209, 52.371128] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '95417', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '075974' },
      geometry: { type: 'Point', coordinates: [4.896699, 52.37149] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '96829', type_id: '5', type_name: 'Grachtmast', objectnummer: '007852' },
      geometry: { type: 'Point', coordinates: [4.895014, 52.370902] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '97065', type_id: '5', type_name: 'Grachtmast', objectnummer: '096078,2' },
      geometry: { type: 'Point', coordinates: [4.895105, 52.371018] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '98068', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '079033,6' },
      geometry: { type: 'Point', coordinates: [4.894725, 52.371201] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '98069', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '079033,5' },
      geometry: { type: 'Point', coordinates: [4.894725, 52.371201] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '98070', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '079033,4' },
      geometry: { type: 'Point', coordinates: [4.894725, 52.371201] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '98071', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '079033,3' },
      geometry: { type: 'Point', coordinates: [4.894725, 52.371201] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '98072', type_id: '3', type_name: 'Gevel_Armatuur', objectnummer: '079033,2' },
      geometry: { type: 'Point', coordinates: [4.894725, 52.371201] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '98073', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '079033,1' },
      geometry: { type: 'Point', coordinates: [4.894725, 52.371201] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '101662', type_id: '2', type_name: 'Overspanning', objectnummer: '000291' },
      geometry: { type: 'Point', coordinates: [4.89698, 52.371395] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '107190', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '147329,1' },
      geometry: { type: 'Point', coordinates: [4.895565, 52.371467] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '107221', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '007852,1' },
      geometry: { type: 'Point', coordinates: [4.895014, 52.370902] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '107222', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '007852,2' },
      geometry: { type: 'Point', coordinates: [4.895014, 52.370902] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '107308', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '002693,1' },
      geometry: { type: 'Point', coordinates: [4.895209, 52.371128] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '107309', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '096078,1' },
      geometry: { type: 'Point', coordinates: [4.895105, 52.371018] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '107310', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '096078,0' },
      geometry: { type: 'Point', coordinates: [4.895105, 52.371018] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '110313', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '155419' },
      geometry: { type: 'Point', coordinates: [4.897055, 52.37149] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '110314', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '155419,1' },
      geometry: { type: 'Point', coordinates: [4.897167, 52.371602] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '124319', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '202251' },
      geometry: { type: 'Point', coordinates: [4.897128, 52.371646] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '124320', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '202252' },
      geometry: { type: 'Point', coordinates: [4.897019, 52.371532] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '126078', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '203832' },
      geometry: { type: 'Point', coordinates: [4.895634, 52.371404] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '126080', type_id: '4', type_name: 'Overig_lichtpunt', objectnummer: '203834' },
      geometry: { type: 'Point', coordinates: [4.894712, 52.371703] },
    },
  ],
};

describe('signals/incident/components/form/MapSelect', () => {
  const parent = {
    meta: {
      updateIncident: jest.fn(),
    },
  };

  const meta = {
    name: 'my_question',
    isVisible: true,
    endpoint: 'foo/bar?',
    legend_items: ['klok'],
  };

  const handler = () => ({ value: 'foo' });

  describe('rendering', () => {
    it('should render the map component', () => {
      const { container, queryByTestId, rerender } = render(
        withAppContext(<MapSelect parent={parent} meta={meta} handler={handler} />)
      );

      expect(queryByTestId('map-base')).toBeInTheDocument();
      expect(container.firstChild.classList.contains('mapSelect')).toBeTruthy();

      rerender(withAppContext(<MapSelect parent={parent} meta={{ ...meta, isVisible: false }} handler={handler} />));

      expect(queryByTestId('map-base')).not.toBeInTheDocument();
    });

    it('should render selected item numbers', () => {
      const { getByText } = render(
        withAppContext(<MapSelect parent={parent} meta={meta} handler={() => ({ value: ['9673465', '808435'] })} />)
      );

      expect(getByText('Het gaat om lamp of lantaarnpaal met nummer: 9673465; 808435')).toBeInTheDocument();
    });

    it('should call parent.meta.updateIncident', async () => {
      fetch.mockResponse(JSON.stringify(jsonResponse));

      const value = ['002635', '147329'];
      const { container, findByTestId } = render(
        withAppContext(<MapSelect parent={parent} meta={meta} handler={() => ({ value })} />)
      );

      await findByTestId('map-base');

      expect(parent.meta.updateIncident).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(container.querySelector(`img[alt="${value[0]}"]`));
      });

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({ [meta.name]: [value[1]] });
    });
  });
});
