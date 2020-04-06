import mapLocation, { formatAddress, featureTolocation } from './index';

const testAddress = {
  openbare_ruimte: 'Keizersgracht',
  huisnummer: 666,
  huisletter: 'D',
  huisnummer_toevoeging: 3,
  postcode: '1016EJ',
  woonplaats: 'Amsterdam',
};

const testLocation = { lng: 4, lat: 52 };

const testFeature = {
  type: 'Point',
  coordinates: [4, 52],
};

describe('featureTolocation', () => {
  it('should convert', () => {
    expect(featureTolocation(testFeature)).toEqual(testLocation);
  });
});

describe('The map location service', () => {
  it('should map geometry', () => {
    expect(mapLocation({
      query: {
        longitude: 4,
        latitude: 52,
      },
    })).toEqual({
      geometrie: {
        type: 'Point',
        coordinates: [
          4,
          52,
        ],
      },
    });
  });

  it('should map omgevingsinfo', () => {
    expect(mapLocation({
      omgevingsinfo: {
        buurtcode: 'A02d',
        stadsdeelcode: 'A',
      },
    })).toEqual({
      buurt_code: 'A02d',
      stadsdeel: 'A',
    });
  });

  it('should map dichtstbijzijnd_adres', () => {
    expect(mapLocation({
      dichtstbijzijnd_adres: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: 666,
        huisletter: 'D',
        huisnummer_toevoeging: 3,
        postcode: '1016EJ',
      },
    })).toEqual({
      address: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: '666',
        huisletter: 'D',
        huisnummer_toevoeging: '3',
        postcode: '1016EJ',
      },
    });
  });
});

describe('The formatAddress', () => {
  it('should render an _ when no data', () => {
    expect(formatAddress({})).toEqual('_');
  });

  it('should render the address name', () => {
    expect(formatAddress(testAddress)).toEqual('Keizersgracht 666D-3, 1016EJ Amsterdam');
  });

  it('should render the address without toevoeging', () => {
    expect(formatAddress(testAddress)).toEqual('Keizersgracht 666D-3, 1016EJ Amsterdam');
    expect(formatAddress({ ...testAddress, huisnummer_toevoeging: null })).toEqual(
      'Keizersgracht 666D, 1016EJ Amsterdam'
    );
  });
});
