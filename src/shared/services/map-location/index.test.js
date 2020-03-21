import mapLocation, { formatAddress, feature2location, address2pdok } from './index';

const testAddress = {
  openbare_ruimte: 'Keizersgracht',
  huisnummer: 666,
  huisletter: 'D',
  huisnummer_toevoeging: 3,
  postcode: '1016EJ',
  woonplaats: 'Amsterdam',
};

const testPdokAddress = {
  straatnaam: 'Keizersgracht',
  huisnummer: '666',
  huisletter: 'D',
  huisnummertoevoeging: '3',
  postcode: '1016EJ',
  woonplaatsnaam: 'Amsterdam',
};

const testLocation = { lng: 4, lat: 52 };

const testFeature = {
  type: 'Point',
  coordinates: [4, 52],
};

describe('feature2location', () => {
  it('should convert', () => {
    expect(feature2location(testFeature)).toEqual(testLocation);
  });
});

describe('address2pdok', () => {
  it('should convert', () => {
    expect(address2pdok(testAddress)).toEqual(testPdokAddress);
  });
});

describe('The map location service', () => {
  it('should map geometry', () => {
    expect(
      mapLocation({
        geometrie: {
          type: 'Point',
          coordinates: [4, 52],
        },
      })
    ).toEqual({
      location: {
        lat: 52,
        lng: 4,
      },
    });
  });

  it('should map omgevingsinfo', () => {
    expect(
      mapLocation({
        buurt_code: 'A02d',
        stadsdeel: 'A',
      })
    ).toEqual({
      buurtcode: 'A02d',
      stadsdeelcode: 'A',
    });
  });

  it('should convert map adress', () => {
    expect(
      mapLocation({
        address: testAddress,
      })
    ).toEqual({
      address: testPdokAddress,
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
