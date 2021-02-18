export default interface Location {
  address?: {
    huisletter?: string;
    huisnummer?: string | number;
    huisnummer_toevoeging?: string;
    openbare_ruimte?: string;
    postcode?: string;
    woonplaats?: string;
  };
  address_text?: string;
  buurt_code?: string;
  id?: number;
  bag_validated?: boolean;
  stadsdeel?: string;
  geometrie?: {
    coordinates?: [number, number];
  };
}
