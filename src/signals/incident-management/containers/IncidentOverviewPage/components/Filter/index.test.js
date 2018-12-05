import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

import Filter from './index';

jest.mock('../../../../components/FieldControlWrapper', () => () => 'FieldControlWrapper');

describe('<Filter />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      categories: {
        main: [
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
            value: 'Afval',
            slug: 'afval'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water',
            value: 'Openbaar groen en water',
            slug: 'openbaar-groen-en-water'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig',
            value: 'Overig',
            slug: 'overig'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca',
            value: 'Overlast Bedrijven en Horeca',
            slug: 'overlast-bedrijven-en-horeca'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
            value: 'Overlast in de openbare ruimte',
            slug: 'overlast-in-de-openbare-ruimte'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water',
            value: 'Overlast op het water',
            slug: 'overlast-op-het-water'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
            value: 'Overlast van dieren',
            slug: 'overlast-van-dieren'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen',
            value: 'Overlast van en door personen of groepen',
            slug: 'overlast-van-en-door-personen-of-groepen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair',
            value: 'Wegen, verkeer, straatmeubilair',
            slug: 'wegen-verkeer-straatmeubilair'
          }
        ],
        sub: [
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
            value: 'Asbest / accu',
            slug: 'asbest-accu'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/bedrijfsafval',
            value: 'Bedrijfsafval',
            slug: 'bedrijfsafval'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-kapot',
            value: 'Container is kapot',
            slug: 'container-is-kapot'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
            value: 'Container is vol',
            slug: 'container-is-vol'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-voor-plastic-afval-is-kapot',
            value: 'Container voor plastic afval is kapot',
            slug: 'container-voor-plastic-afval-is-kapot'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-voor-plastic-afval-is-vol',
            value: 'Container voor plastic afval is vol',
            slug: 'container-voor-plastic-afval-is-vol'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/grofvuil',
            value: 'Grofvuil',
            slug: 'grofvuil'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
            value: 'Huisafval',
            slug: 'huisafval'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/overig-afval',
            value: 'Overig afval',
            slug: 'overig-afval'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/prullenbak-is-kapot',
            value: 'Prullenbak is kapot',
            slug: 'prullenbak-is-kapot'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/prullenbak-is-vol',
            value: 'Prullenbak is vol',
            slug: 'prullenbak-is-vol'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/puin-sloopafval',
            value: 'Puin / sloopafval',
            slug: 'puin-sloopafval'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/veeg-zwerfvuil',
            value: 'Veeg- / zwerfvuil',
            slug: 'veeg-zwerfvuil'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom',
            value: 'Boom',
            slug: 'boom'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/drijfvuil',
            value: 'Drijfvuil',
            slug: 'drijfvuil'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/maaien-snoeien',
            value: 'Maaien / snoeien',
            slug: 'maaien-snoeien'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/oever-kade-steiger',
            value: 'Oever / kade / steiger',
            slug: 'oever-kade-steiger'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/onkruid',
            value: 'Onkruid',
            slug: 'onkruid'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/overig-groen-en-water',
            value: 'Overig groen en water',
            slug: 'overig-groen-en-water'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
            value: 'Overig',
            slug: 'overig'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/geluidsoverlast-installaties',
            value: 'Geluidsoverlast installaties',
            slug: 'geluidsoverlast-installaties'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/geluidsoverlast-muziek',
            value: 'Geluidsoverlast muziek',
            slug: 'geluidsoverlast-muziek'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven',
            value: 'Overig horeca/bedrijven',
            slug: 'overig-horecabedrijven'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-door-bezoekers-niet-op-terras',
            value: 'Overlast door bezoekers (niet op terras)',
            slug: 'overlast-door-bezoekers-niet-op-terras'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-terrassen',
            value: 'Overlast terrassen',
            slug: 'overlast-terrassen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/stank-horecabedrijven',
            value: 'Stank horeca/bedrijven',
            slug: 'stank-horecabedrijven'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/stankoverlast',
            value: 'Stankoverlast',
            slug: 'stankoverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/auto-scooter-bromfietswrak',
            value: 'Auto- / scooter- / bromfiets(wrak)',
            slug: 'auto-scooter-bromfietswrak'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/bouw-sloopoverlast',
            value: 'Bouw- / sloopoverlast',
            slug: 'bouw-sloopoverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/deelfiets',
            value: 'Deelfiets',
            slug: 'deelfiets'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/fietswrak',
            value: 'Fietswrak',
            slug: 'fietswrak'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/graffiti-wildplak',
            value: 'Graffiti / wildplak',
            slug: 'graffiti-wildplak'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hinderlijk-geplaatst-object',
            value: 'Hinderlijk geplaatst object',
            slug: 'hinderlijk-geplaatst-object'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
            value: 'Honden(poep)',
            slug: 'hondenpoep'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/lozing-dumping-bodemverontreiniging',
            value: 'Lozing / dumping / bodemverontreiniging',
            slug: 'lozing-dumping-bodemverontreiniging'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte',
            value: 'Overig openbare ruimte',
            slug: 'overig-openbare-ruimte'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
            value: 'Parkeeroverlast',
            slug: 'parkeeroverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/stank-geluidsoverlast',
            value: 'Stank- / geluidsoverlast',
            slug: 'stank-geluidsoverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/wegsleep',
            value: 'Wegsleep',
            slug: 'wegsleep'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overig-boten',
            value: 'Overig boten',
            slug: 'overig-boten'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-geluid',
            value: 'Overlast op het water - geluid',
            slug: 'overlast-op-het-water-geluid'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-gezonken-boot',
            value: 'Overlast op het water - Gezonken boot',
            slug: 'overlast-op-het-water-gezonken-boot'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-snel-varen',
            value: 'Overlast op het water - snel varen',
            slug: 'overlast-op-het-water-snel-varen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-vaargedrag',
            value: 'Overlast op het water - Vaargedrag',
            slug: 'overlast-op-het-water-vaargedrag'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-vanaf-het-water',
            value: 'Overlast vanaf het water',
            slug: 'overlast-vanaf-het-water'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/scheepvaart-nautisch-toezicht',
            value: 'Scheepvaart nautisch toezicht',
            slug: 'scheepvaart-nautisch-toezicht'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
            value: 'Dode dieren',
            slug: 'dode-dieren'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
            value: 'Duiven',
            slug: 'duiven'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
            value: 'Ganzen',
            slug: 'ganzen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/meeuwen',
            value: 'Meeuwen',
            slug: 'meeuwen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/overig-dieren',
            value: 'Overig dieren',
            slug: 'overig-dieren'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ratten',
            value: 'Ratten',
            slug: 'ratten'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/wespen',
            value: 'Wespen',
            slug: 'wespen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/daklozen-bedelen',
            value: 'Daklozen / bedelen',
            slug: 'daklozen-bedelen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/drank-en-drugsoverlast',
            value: 'Drank- en drugsoverlast',
            slug: 'drank-en-drugsoverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/jongerenoverlast',
            value: 'Jongerenoverlast',
            slug: 'jongerenoverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
            value: 'Overige overlast door personen',
            slug: 'overige-overlast-door-personen'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overlast-door-afsteken-vuurwerk',
            value: 'Overlast door afsteken vuurwerk',
            slug: 'overlast-door-afsteken-vuurwerk'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overlast-van-taxis-bussen-en-fietstaxis',
            value: 'Overlast van taxi\'s, bussen en fietstaxi\'s',
            slug: 'overlast-van-taxis-bussen-en-fietstaxis'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/personen-op-het-water',
            value: 'Personen op het water',
            slug: 'personen-op-het-water'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/vuurwerkoverlast',
            value: 'Vuurwerkoverlast',
            slug: 'vuurwerkoverlast'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/wildplassen-poepen-overgeven',
            value: 'Wildplassen / poepen / overgeven',
            slug: 'wildplassen-poepen-overgeven'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/brug',
            value: 'Brug',
            slug: 'brug'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/fietsrek-nietje',
            value: 'Fietsrek / nietje',
            slug: 'fietsrek-nietje'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
            value: 'Gladheid',
            slug: 'gladheid'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/klok',
            value: 'Klok',
            slug: 'klok'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/omleiding-belijning-verkeer',
            value: 'Omleiding / belijning verkeer',
            slug: 'omleiding-belijning-verkeer'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-stoep-straat-en-fietspad',
            value: 'Onderhoud stoep, straat en fietspad',
            slug: 'onderhoud-stoep-straat-en-fietspad'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/overig-wegen-verkeer-straatmeubilair',
            value: 'Overig Wegen, verkeer, straatmeubilair',
            slug: 'overig-wegen-verkeer-straatmeubilair'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/put-riolering-verstopt',
            value: 'Put / riolering verstopt',
            slug: 'put-riolering-verstopt'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/speelplaats',
            value: 'Speelplaats',
            slug: 'speelplaats'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/sportvoorziening',
            value: 'Sportvoorziening',
            slug: 'sportvoorziening'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatmeubilair',
            value: 'Straatmeubilair',
            slug: 'straatmeubilair'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
            value: 'Straatverlichting / openbare klok',
            slug: 'straatverlichting-openbare-klok'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeersbord-verkeersafzetting',
            value: 'Verkeersbord, verkeersafzetting',
            slug: 'verkeersbord-verkeersafzetting'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeerslicht',
            value: 'Verkeerslicht',
            slug: 'verkeerslicht'
          },
          {
            key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeersoverlast-verkeerssituaties',
            value: 'Verkeersoverlast / Verkeerssituaties',
            slug: 'verkeersoverlast-verkeerssituaties'
          }
        ],
        mainToSub: {
          '': [
            'asbest-accu',
            'bedrijfsafval',
            'container-is-kapot',
            'container-is-vol',
            'container-voor-plastic-afval-is-kapot',
            'container-voor-plastic-afval-is-vol',
            'grofvuil',
            'huisafval',
            'overig-afval',
            'prullenbak-is-kapot',
            'prullenbak-is-vol',
            'puin-sloopafval',
            'veeg-zwerfvuil',
            'boom',
            'drijfvuil',
            'maaien-snoeien',
            'oever-kade-steiger',
            'onkruid',
            'overig-groen-en-water',
            'overig',
            'geluidsoverlast-installaties',
            'geluidsoverlast-muziek',
            'overig-horecabedrijven',
            'overlast-door-bezoekers-niet-op-terras',
            'overlast-terrassen',
            'stank-horecabedrijven',
            'stankoverlast',
            'auto-scooter-bromfietswrak',
            'bouw-sloopoverlast',
            'deelfiets',
            'fietswrak',
            'graffiti-wildplak',
            'hinderlijk-geplaatst-object',
            'hondenpoep',
            'lozing-dumping-bodemverontreiniging',
            'overig-openbare-ruimte',
            'parkeeroverlast',
            'stank-geluidsoverlast',
            'wegsleep',
            'overig-boten',
            'overlast-op-het-water-geluid',
            'overlast-op-het-water-gezonken-boot',
            'overlast-op-het-water-snel-varen',
            'overlast-op-het-water-vaargedrag',
            'overlast-vanaf-het-water',
            'scheepvaart-nautisch-toezicht',
            'dode-dieren',
            'duiven',
            'ganzen',
            'meeuwen',
            'overig-dieren',
            'ratten',
            'wespen',
            'daklozen-bedelen',
            'drank-en-drugsoverlast',
            'jongerenoverlast',
            'overige-overlast-door-personen',
            'overlast-door-afsteken-vuurwerk',
            'overlast-van-taxis-bussen-en-fietstaxis',
            'personen-op-het-water',
            'vuurwerkoverlast',
            'wildplassen-poepen-overgeven',
            'brug',
            'fietsrek-nietje',
            'gladheid',
            'klok',
            'omleiding-belijning-verkeer',
            'onderhoud-stoep-straat-en-fietspad',
            'overig-wegen-verkeer-straatmeubilair',
            'put-riolering-verstopt',
            'speelplaats',
            'sportvoorziening',
            'straatmeubilair',
            'straatverlichting-openbare-klok',
            'verkeersbord-verkeersafzetting',
            'verkeerslicht',
            'verkeersoverlast-verkeerssituaties'
          ],
          'overlast-in-de-openbare-ruimte': [
            'auto-scooter-bromfietswrak',
            'bouw-sloopoverlast',
            'deelfiets',
            'fietswrak',
            'graffiti-wildplak',
            'hinderlijk-geplaatst-object',
            'hondenpoep',
            'lozing-dumping-bodemverontreiniging',
            'overig-openbare-ruimte',
            'parkeeroverlast',
            'stank-geluidsoverlast',
            'wegsleep'
          ],
          'openbaar-groen-en-water': [
            'boom',
            'drijfvuil',
            'maaien-snoeien',
            'oever-kade-steiger',
            'onkruid',
            'overig-groen-en-water'
          ],
          'overlast-van-dieren': [
            'dode-dieren',
            'duiven',
            'ganzen',
            'meeuwen',
            'overig-dieren',
            'ratten',
            'wespen'
          ],
          'overlast-van-en-door-personen-of-groepen': [
            'daklozen-bedelen',
            'drank-en-drugsoverlast',
            'jongerenoverlast',
            'overige-overlast-door-personen',
            'overlast-door-afsteken-vuurwerk',
            'overlast-van-taxis-bussen-en-fietstaxis',
            'personen-op-het-water',
            'vuurwerkoverlast',
            'wildplassen-poepen-overgeven'
          ],
          'wegen-verkeer-straatmeubilair': [
            'brug',
            'fietsrek-nietje',
            'gladheid',
            'klok',
            'omleiding-belijning-verkeer',
            'onderhoud-stoep-straat-en-fietspad',
            'overig-wegen-verkeer-straatmeubilair',
            'put-riolering-verstopt',
            'speelplaats',
            'sportvoorziening',
            'straatmeubilair',
            'straatverlichting-openbare-klok',
            'verkeersbord-verkeersafzetting',
            'verkeerslicht',
            'verkeersoverlast-verkeerssituaties'
          ],
          overig: [
            'overig'
          ],
          'overlast-op-het-water': [
            'overig-boten',
            'overlast-op-het-water-geluid',
            'overlast-op-het-water-gezonken-boot',
            'overlast-op-het-water-snel-varen',
            'overlast-op-het-water-vaargedrag',
            'overlast-vanaf-het-water',
            'scheepvaart-nautisch-toezicht'
          ],
          'overlast-bedrijven-en-horeca': [
            'geluidsoverlast-installaties',
            'geluidsoverlast-muziek',
            'overig-horecabedrijven',
            'overlast-door-bezoekers-niet-op-terras',
            'overlast-terrassen',
            'stank-horecabedrijven',
            'stankoverlast'
          ],
          afval: [
            'asbest-accu',
            'bedrijfsafval',
            'container-is-kapot',
            'container-is-vol',
            'container-voor-plastic-afval-is-kapot',
            'container-voor-plastic-afval-is-vol',
            'grofvuil',
            'huisafval',
            'overig-afval',
            'prullenbak-is-kapot',
            'prullenbak-is-vol',
            'puin-sloopafval',
            'veeg-zwerfvuil'
          ]
        }
      },
      statusList: [
        {
          key: '',
          value: 'Alle statussen'
        },
        {
          key: 'm',
          value: 'Gemeld'
        },
        {
          key: 'i',
          value: 'In afwachting van behandeling'
        },
        {
          key: 'b',
          value: 'In behandeling'
        },
        {
          key: 'o',
          value: 'Afgehandeld'
        },
        {
          key: 'h',
          value: 'On hold'
        },
        {
          key: 'a',
          value: 'Geannuleerd'
        }

      ],
      stadsdeelList: [
        {
          key: '',
          value: 'Alle stadsdelen'
        },
        {
          key: 'A',
          value: 'Centrum'
        },
        {
          key: 'B',
          value: 'Westpoort'
        },
        {
          key: 'E',
          value: 'West'
        },
        {
          key: 'M',
          value: 'Oost'
        },
        {
          key: 'N',
          value: 'Noord'
        },
        {
          key: 'T',
          value: 'Zuidoost'
        },
        {
          key: 'K',
          value: 'Zuid'
        },
        {
          key: 'F',
          value: 'Nieuw-West'
        }
      ],
      priorityList: [
        {
          key: '',
          value: 'Alles'
        },
        {
          key: 'normal',
          value: 'Normaal'
        },
        {
          key: 'high',
          value: 'Hoog'
        }
      ],
      onRequestIncidents: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn()
    };

    wrapper = shallow(
      <Filter {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    wrapper = shallow(<Filter {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with set filter correctly ', () => {
    props.filter = {
      id: '',
      incident_date_start: null,
      priority__priority: null,
      main_slug: null,
      sub_slug: null,
      location__address_text: null,
      location__stadsdeel: ['B'],
      status__state: null,

    };
    wrapper = shallow(<Filter {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should contain the FieldGroup', () => {
    wrapper = shallow(<Filter {...props} />);

    expect(wrapper.find(FieldGroup)).toHaveLength(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      wrapper = shallow(<Filter {...props} />);
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
    });

    it('should render correctly', () => {
      expect(renderedFormGroup).toMatchSnapshot();
    });

    it('should render 2 buttons', () => {
      expect(renderedFormGroup.find('button').length).toEqual(2);
    });

    it('should reset the form when the reset button is clicked', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterEmptyValue = {
        id: null,
        incident_date_start: null,
        priority__priority: null,
        main_slug: null,
        sub_slug: null,
        location__address_text: null,
        location__stadsdeel: null,
        status__state: null,
      };
      const filterValue = { id: 50 };
      filterForm.patchValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);

      jest.spyOn(filterForm, 'reset');

      renderedFormGroup.find('button').at(0).simulate('click');
      expect(filterForm.reset).toHaveBeenCalled();
      expect(props.onRequestIncidents).toHaveBeenCalled();
      expect(filterForm.value).toEqual(filterEmptyValue);
    });

    it('should filter when form is submitted (search button is clicked)', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        id: 50,
        location__address_text: 'dam'
      };
      filterForm.setValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);
      expect(filterForm.value.location__address_text).toEqual(filterValue.location__address_text);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() {} });
      expect(filterForm.value).toEqual(filterValue);
      expect(props.onRequestIncidents).toHaveBeenCalledWith({ filter: filterValue });
    });

    it('should not render subcategoryList when there are less than 2 items', () => {
      wrapper.setProps({
        subcategoryList: [1, 2]
      });

      expect(renderedFormGroup).toMatchSnapshot();
    });
  });
});
