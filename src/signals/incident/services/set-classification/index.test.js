import subcategories from 'subcategories.mock'; // eslint-disable-line import/extensions, import/no-unresolved

import setClassification, { MINIMUM_CERTAINTY } from './index';

describe('The set classification service', () => {
  let hoofdrubriek;
  let subrubriek;

  beforeEach(() => {
    subrubriek = [
      [
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/wildplassen-poepen-overgeven',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
      ],
      [0.39, 0.1424216693948545, 0.04586915076913858],
    ];

    hoofdrubriek = [
      [
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen',
      ],
      [0.39, 0.1424216693948545, 0.04586915076913858],
    ];
  });

  it('should return Overig by default', () => {
    expect(setClassification({})).toEqual({
      category: 'overig',
      subcategory: 'overig',
      handling_message: 'Niet gevonden.',
      subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
    });
  });

  it('should return Overig by default with subcategories', () => {
    expect(setClassification({}, subcategories)).toEqual({
      category: 'overig',
      subcategory: 'overig',
      handling_message: '\nUw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
      subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
    });
  });

  it('should return correct classification when minimum subcategory chance is met', () => {
    subrubriek[1][0] = MINIMUM_CERTAINTY;

    expect(
      setClassification({ subrubriek, hoofdrubriek }, subcategories)
    ).toEqual({
      category: 'overlast-in-de-openbare-ruimte',
      subcategory: 'hondenpoep',
      handling_message: '\nWe laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
      subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
    });
  });

  it('should return Overig when minimum maincategory and subcategory chance are not met', () => {
    expect(
      setClassification({ subrubriek, hoofdrubriek }, subcategories)
    ).toEqual({
      category: 'overig',
      subcategory: 'overig',
      handling_message: '\nUw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
      subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
    });
  });

  describe('use main classification when sub category fails', () => {
    describe('afval', () => {
      it('should return overig-afval when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'afval',
          subcategory: 'overig-afval',
          handling_message: '\nWij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/overig-afval',
        });
      });
    });

    describe('openbaar-groen-en-water', () => {
      it('should return overig-groen-en-water when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'openbaar-groen-en-water',
          subcategory: 'overig-groen-en-water',
          handling_message: '\nWij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/overig-groen-en-water',
        });
      });
    });

    describe('overlast-bedrijven-en-horeca', () => {
      it('should return overig-horecabedrijven when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'overlast-bedrijven-en-horeca',
          subcategory: 'overig-horecabedrijven',
          handling_message: '\nWij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven',
        });
      });
    });

    describe('overlast-in-de-openbare-ruimte', () => {
      it('should return overig-openbare-ruimte when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'overlast-in-de-openbare-ruimte',
          subcategory: 'overig-openbare-ruimte',
          handling_message: 'zou niet leeg moeten zijn',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte',
        });
      });
    });

    describe('overlast-op-het-water', () => {
      it('should return overig-boten when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'overlast-op-het-water',
          subcategory: 'overig-boten',
          handling_message: '\nWe geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.\n\nAls er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).\n',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overig-boten',
        });
      });
    });

    describe('overlast-van-dieren', () => {
      it('should return overig-dieren when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'overlast-van-dieren',
          subcategory: 'overig-dieren',
          handling_message: '\nWij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/overig-dieren',
        });
      });
    });

    describe('overlast-van-en-door-personen-of-groepen', () => {
      it('should return overige-overlast-door-personen when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'overlast-van-en-door-personen-of-groepen',
          subcategory: 'overige-overlast-door-personen',
          handling_message: '\nWij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
        });
      });
    });

    describe('wegen-verkeer-straatmeubilair', () => {
      it('should return overig-wegen-verkeer-straatmeubilair when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'wegen-verkeer-straatmeubilair',
          subcategory: 'overig-wegen-verkeer-straatmeubilair',
          handling_message: '\nWij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/overig-wegen-verkeer-straatmeubilair',
        });
      });
    });

    describe('unknown-category', () => {
      it('should return overig when minimum subcategory chance is not met and maincategory chance is met', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/unknown-category';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek }, subcategories)
        ).toEqual({
          category: 'overig',
          subcategory: 'overig',
          handling_message: '\nUw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
        });
      });

      it('should return overig when minimum subcategory chance is not met and maincategory chance is met without subcategories', () => {
        hoofdrubriek[0][0] = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/unknown-category';
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY;

        expect(
          setClassification({ subrubriek, hoofdrubriek })
        ).toEqual({
          category: 'overig',
          subcategory: 'overig',
          handling_message: 'Niet gevonden.',
          subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
        });
      });
    });
  });
});
