export const fetchCategoriesResponse = {
  _links: {
    self: {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/',
    },
    next: {
      href: null,
    },
    previous: {
      href: null,
    },
  },
  count: 16,
  results: [
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
        },
      },
      _display: 'Afval',
      name: 'Afval',
      slug: 'afval',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Asbest / accu (Afval)',
          name: 'Asbest / accu',
          slug: 'asbest-accu',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'FB',
              name: 'FB',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Alles met betrekking tot asbest gerelateerd afval en bijtende/corrosieve vloeistoffen.',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.  [Bekijk de kaart met slimme apparaten](https://slimmeapparaten.amsterdam.nl)',
          public_name: 'Asbest',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/bedrijfsafval',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Bedrijfsafval (Afval)',
          name: 'Bedrijfsafval',
          slug: 'bedrijfsafval',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Afval van een bedrijf en andere gebouwen en dingen',
          handling_message:
            'We laten u binnen 5 dagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/bruin-en-witgoed',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Bruin- en witgoed (Afval)',
          name: 'Bruin- en witgoed',
          slug: 'bruin-en-witgoed',
          handling: 'A3DEC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Bruin en witgoed zijn zaken als: wasmachines, koelkasten, magnetrons of andere zaken met een motor en kleine electrische huishoudelijke spullen.',
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. Als u een mailadres hebt opgegeven, zullen we u op de hoogte houden.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-bijplaatsing',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Container bijplaatsing (Afval)',
          name: 'Container bijplaatsing',
          slug: 'container-bijplaatsing',
          handling: 'A3DMC',
          departments: [
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Meldingen bijplaatsing naast container',
          handling_message:
            'Wij gaan aan het werk met uw melding. Als het dringend is komen we direct in actie. U hoort binnen 3 werkdagen wat wij hebben gedaan.',
          public_name: 'Afval naast de container',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-glas-kapot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-glas-kapot/glas.svg?temp_url_sig=7b6c01926248bbb41d4de407f2e6a14f970d3d790ecc0d9ca6102bae2332e7c8&temp_url_expires=1665401494',
            },
          },
          _display: 'Container glas kapot (Afval)',
          name: 'Container glas kapot',
          slug: 'container-glas-kapot',
          handling: 'A3WMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\r\nWe houden u op de hoogte via e-mail.',
          public_name: 'Container glas kapot',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-glas-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-glas-vol/glas.svg?temp_url_sig=164091a6e44be0c0a8732deb57bf4a863121c436ebe646a2bb565aa45717d522&temp_url_expires=1665401494',
            },
          },
          _display: 'Container glas vol (Afval)',
          name: 'Container glas vol',
          slug: 'container-glas-vol',
          handling: 'A3WMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\r\nWe houden u op de hoogte via e-mail.',
          public_name: 'Container glas vol',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-kapot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-is-kapot/rest.svg?temp_url_sig=07b6f7ca4ec4593d40ded51342b85d4acbc599dd439dd500743fe6c7bd8bcb2d&temp_url_expires=1665401494',
            },
          },
          _display: 'Container is kapot (Afval)',
          name: 'Container is kapot',
          slug: 'container-is-kapot',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Een verhaal over een kapotte container',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\r\nWe houden u op de hoogte via e-mail.',
          public_name:
            'Restafval container is kapot of vol. Of er is iets anders aan de hand. In elk geval er kan niks meer in de container.',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Container is vol (Afval)',
          name: 'Container is vol',
          slug: 'container-is-vol',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Dit is een testje',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: '',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-voor-papier-is-stuk',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-voor-papier-is-stuk/papier.svg?temp_url_sig=4ade18a3c4d5f1a62b1e5e37165525dd275216ad258f4f1672fcecf907ea81eb&temp_url_expires=1665401494',
            },
          },
          _display: 'Container papier kapot (Afval)',
          name: 'Container papier kapot',
          slug: 'container-voor-papier-is-stuk',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\r\nWe houden u op de hoogte via e-mail.',
          public_name: 'Container papier kapot',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-voor-papier-is-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-voor-papier-is-vol/papier.svg?temp_url_sig=76ad7e9d14463e6febbe7b1f331e7463e3dbeb97da5e7a69f1625470c983f073&temp_url_expires=1665401494',
            },
          },
          _display: 'Container papier vol (Afval)',
          name: 'Container papier vol',
          slug: 'container-voor-papier-is-vol',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\r\nWe houden u op de hoogte via e-mail.',
          public_name: 'Container papier vol',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-voor-plastic-afval-is-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Container plastic afval vol (Afval)',
          name: 'Container plastic afval vol',
          slug: 'container-voor-plastic-afval-is-vol',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: 'Container plastic afval vol',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-voor-plastic-afval-is-kapot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Container plastic kapot (Afval)',
          name: 'Container plastic kapot',
          slug: 'container-voor-plastic-afval-is-kapot',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: 'Container plastic kapot',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/grofvuil',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Grofvuil (Afval)',
          name: 'Grofvuil',
          slug: 'grofvuil',
          handling: 'A3DEVOMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
            {
              code: 'VIS',
              name: 'V&OR - VIS',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Meubels of andere grote spullen uit uw huis, grote elektrische apparaten, snoeiafval, hout en glas.',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken. We houden u op de hoogte.',
          public_name: 'Grof en vuil',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/handhaving-op-afval',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Handhaving op afval (Afval)',
          name: 'Handhaving op afval',
          slug: 'handhaving-op-afval',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Huisafval (Afval)',
          name: 'Huisafval',
          slug: 'huisafval',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
            {
              code: 'VIS',
              name: 'V&OR - VIS',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: 'Huisafval',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/kerstbomen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Kerstbomen (Afval)',
          name: 'Kerstbomen',
          slug: 'kerstbomen',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Meldingen over aangeboden/gedumpte Kerstbomen',
          handling_message:
            'Wij hebben uw melding doorgestuurd naar de uitvoering. Normaal gesproken handelen wij uw melding binnen 3 werkdagen af. Helaas is in verband met corona ons ziekteverzuim hoger dan normaal. Wij doen ons uiterste best om uw melding zo snel mogelijk af te handelen. Uiteraard houden wij rekening met meldingen die urgent zijn.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/overig-afval',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/overig-afval/rest.svg?temp_url_sig=2805c1579290df976aa46759e6e03341a827c8af7dc31dcd482a587c17ca7bbb&temp_url_expires=1665401494',
            },
          },
          _display: 'Overig afval (Afval)',
          name: 'Overig afval',
          slug: 'overig-afval',
          handling: 'REST',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          public_name: null,
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/prullenbak-is-kapot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Prullenbak is kapot (Afval)',
          name: 'Prullenbak is kapot',
          slug: 'prullenbak-is-kapot',
          handling: 'A3DMC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/prullenbak-is-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Prullenbak is vol (Afval)',
          name: 'Prullenbak is vol',
          slug: 'prullenbak-is-vol',
          handling: 'A3DEC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/puin-sloopafval',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Puin- / sloopafval (Afval)',
          name: 'Puin- / sloopafval',
          slug: 'puin-sloopafval',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/rolcontainer-is-kapot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Rolcontainer is kapot (Afval)',
          name: 'Rolcontainer is kapot',
          slug: 'rolcontainer-is-kapot',
          handling: 'EMPTY',
          departments: [
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Aanvragen rolcontainer(s) bewoners, defecte rolcontainer(s) bewoners, wisselen rolcontainer(s) bewoners',
          handling_message:
            'Wij gaan aan het werk met uw melding. Als het dringend is komen we direct in actie. U hoort binnen 10 werkdagen wat wij hebben gedaan.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/rolcontainer-is-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Rolcontainer is vol (Afval)',
          name: 'Rolcontainer is vol',
          slug: 'rolcontainer-is-vol',
          handling: 'A3DMC',
          departments: [
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Meldingen rolcontainer(s) bewoners  vol/niet geleegd.',
          handling_message:
            'Wij gaan aan het werk met uw melding. Als het dringend is komen we direct in actie. U hoort binnen 3 werkdagen wat wij hebben gedaan.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/veeg-zwerfvuil',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
            },
          },
          _display: 'Veeg- / zwerfvuil (Afval)',
          name: 'Veeg- / zwerfvuil',
          slug: 'veeg-zwerfvuil',
          handling: 'A3DEC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
        },
      },
      _display: 'Civiele Constructies',
      name: 'Civiele Constructies',
      slug: 'civiele-constructies',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/afwatering-brug',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Afwatering brug (Civiele Constructies)',
          name: 'Afwatering brug',
          slug: 'afwatering-brug',
          handling: 'URGENTE_MELDINGEN',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Dit is het verhaal van de brug die moest afwateren.',
          handling_message:
            'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail. Zie [www.amsterdam.nl](https://www.amsterdam.nl) voor details.\n\n## Header level 2\n> Blockquote\n* List item #1\n* List item #2',
          public_name: 'Test',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/bruggen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Brug (Civiele Constructies)',
          name: 'Brug',
          slug: 'bruggen',
          handling: 'A3WEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer. [Gemeente Amsterdam](http://www.amsterdam.nl) En anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/brug-bediening',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Brug bediening (Civiele Constructies)',
          name: 'Brug bediening',
          slug: 'brug-bediening',
          handling: 'A3WEC',
          departments: [
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\n\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.\n\nBedankt, hoor.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/kades',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Kades (Civiele Constructies)',
          name: 'Kades',
          slug: 'kades',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/oevers',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Oevers (Civiele Constructies)',
          name: 'Oevers',
          slug: 'oevers',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/riolering-verstopte-kolk',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Riolering - verstopte kolk (Civiele Constructies)',
          name: 'Riolering - verstopte kolk',
          slug: 'riolering-verstopte-kolk',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: false,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/sluis',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Sluis (Civiele Constructies)',
          name: 'Sluis',
          slug: 'sluis',
          handling: 'URGENTE_MELDINGEN',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/steiger',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Steiger (Civiele Constructies)',
          name: 'Steiger',
          slug: 'steiger',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/verzakking-kades',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Verzakking van kades (Civiele Constructies)',
          name: 'Verzakking van kades',
          slug: 'verzakking-kades',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/watergangen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/civiele-constructies/bruggen_kades.svg?temp_url_sig=c658c9a0759fa9c97b53f00414849dade49d0e25abca5ff26bcc5121311d01bc&temp_url_expires=1665401494',
            },
          },
          _display: 'Watergangen (Civiele Constructies)',
          name: 'Watergangen',
          slug: 'watergangen',
          handling: 'URGENTE_MELDINGEN',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/ondermijning',
        },
      },
      _display: 'Ondermijning',
      name: 'Ondermijning',
      slug: 'ondermijning',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/ondermijning/sub_categories/vermoeden',
            },
          },
          _display: 'Vermoeden (Ondermijning)',
          name: 'Vermoeden',
          slug: 'vermoeden',
          handling: 'ONDERMIJNING',
          departments: [
            {
              code: 'OOV',
              name: 'Openbare Orde & Veiligheid',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Bedankt voor uw melding. Wij nemen deze mee in ons onderzoek.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
        },
      },
      _display: 'Openbaar groen en water',
      name: 'Openbaar groen en water',
      slug: 'openbaar-groen-en-water',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/beplanting',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Beplanting (Openbaar groen en water)',
          name: 'Beplanting',
          slug: 'beplanting',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-aanvraag-plaatsing',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - aanvraag plaatsing (Openbaar groen en water)',
          name: 'Boom - aanvraag plaatsing',
          slug: 'boom-aanvraag-plaatsing',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-boomstob',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - boomstob (Openbaar groen en water)',
          name: 'Boom - boomstob',
          slug: 'boom-boomstob',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - dood (Openbaar groen en water)',
          name: 'Boom - dood',
          slug: 'boom',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Boom dood',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-illegale-kap',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - illegale kap (Openbaar groen en water)',
          name: 'Boom - illegale kap',
          slug: 'boom-illegale-kap',
          handling: 'I5DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-noodkap',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - noodkap (Openbaar groen en water)',
          name: 'Boom - noodkap',
          slug: 'boom-noodkap',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Bomen die in geval van nood gekapt moeten worden.',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-overig',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - overig (Openbaar groen en water)',
          name: 'Boom - overig',
          slug: 'boom-overig',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-afval',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - plastic en overig afval (Openbaar groen en water)',
          name: 'Boom - plastic en overig afval',
          slug: 'boom-afval',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-spiegel',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - spiegel (Openbaar groen en water)',
          name: 'Boom - spiegel',
          slug: 'boom-spiegel',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-stormschade',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - stormschade (Openbaar groen en water)',
          name: 'Boom - stormschade',
          slug: 'boom-stormschade',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-verzoek-inspectie',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - verzoek inspectie (Openbaar groen en water)',
          name: 'Boom - verzoek inspectie',
          slug: 'boom-verzoek-inspectie',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boomziekten-en-plagen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
            },
          },
          _display: 'Boom - ziekten en plagen (Openbaar groen en water)',
          name: 'Boom - ziekten en plagen',
          slug: 'boomziekten-en-plagen',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Bomen die een ziekte hebben.',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/drijfvuil',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Drijfvuil bevaarbaar water (Openbaar groen en water)',
          name: 'Drijfvuil bevaarbaar water',
          slug: 'drijfvuil',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: 'Afval in water waar gevaren kan worden',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/eikenprocessierups',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Eikenprocessierups (Openbaar groen en water)',
          name: 'Eikenprocessierups',
          slug: 'eikenprocessierups',
          handling: 'EMPTY',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt beoordeeld en indien nodig ingepland: wij laten u binnen twee weken weten hoe en wanneer uw melding wordt afgehandeld. Als u een mailadres hebt opgegeven, zullen we u op de hoogte houden.',
          public_name: 'Eikenprocessierups',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/japanse-duizendknoop',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Japanse duizendknoop (Openbaar groen en water)',
          name: 'Japanse duizendknoop',
          slug: 'japanse-duizendknoop',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/maaien-snoeien',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Maaien (Openbaar groen en water)',
          name: 'Maaien',
          slug: 'maaien-snoeien',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'blah',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/oever-kade-steiger',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Oever (Openbaar groen en water)',
          name: 'Oever',
          slug: 'oever-kade-steiger',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/onkruid',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Onkruid in het groen (Openbaar groen en water)',
          name: 'Onkruid in het groen',
          slug: 'onkruid',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/overig-groen-en-water',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Overig groen en water (Openbaar groen en water)',
          name: 'Overig groen en water',
          slug: 'overig-groen-en-water',
          handling: 'REST',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/snoeien',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=1b6a5a35da04670eeda035b83535a810ab6eae4a34c84d2fd02f1a7eed77519d&temp_url_expires=1665401495',
            },
          },
          _display: 'Snoeien (Openbaar groen en water)',
          name: 'Snoeien',
          slug: 'snoeien',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig',
        },
      },
      _display: 'Overig',
      name: 'Overig',
      slug: 'overig',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig',
            },
          },
          _display: 'Overig (Overig)',
          name: 'Overig',
          slug: 'overig',
          handling: 'I5DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: 'Overig - overig (Publieke naam)',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overige-dienstverlening',
            },
          },
          _display: 'Overige dienstverlening (Overig)',
          name: 'Overige dienstverlening',
          slug: 'overige-dienstverlening',
          handling: 'REST',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
        },
      },
      _display: 'Overlast Bedrijven en Horeca',
      name: 'Overlast Bedrijven en Horeca',
      slug: 'overlast-bedrijven-en-horeca',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/geluidsoverlast-installaties',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display:
            'Geluidsoverlast installaties (Overlast Bedrijven en Horeca)',
          name: 'Geluidsoverlast installaties',
          slug: 'geluidsoverlast-installaties',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: 'Geluidsoverlast installaties',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/geluidsoverlast-muziek',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display: 'Geluidsoverlast muziek (Overlast Bedrijven en Horeca)',
          name: 'Geluidsoverlast muziek',
          slug: 'geluidsoverlast-muziek',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: 'Geluidsoverlast muziek',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display: 'Overig bedrijven / horeca (Overlast Bedrijven en Horeca)',
          name: 'Overig bedrijven / horeca',
          slug: 'overig-horecabedrijven',
          handling: 'REST',
          departments: [
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-door-bezoekers-niet-op-terras',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display:
            'Overlast door bezoekers (niet op terras) (Overlast Bedrijven en Horeca)',
          name: 'Overlast door bezoekers (niet op terras)',
          slug: 'overlast-door-bezoekers-niet-op-terras',
          handling: 'I5DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-terrassen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display: 'Overlast terrassen (Overlast Bedrijven en Horeca)',
          name: 'Overlast terrassen',
          slug: 'overlast-terrassen',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/stank-horecabedrijven',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display: 'Stank horeca/bedrijven (Overlast Bedrijven en Horeca)',
          name: 'Stank horeca/bedrijven',
          slug: 'stank-horecabedrijven',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/stankoverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495',
            },
          },
          _display: 'Stankoverlast (Overlast Bedrijven en Horeca)',
          name: 'Stankoverlast',
          slug: 'stankoverlast',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
        },
      },
      _display: 'Overlast in de openbare ruimte',
      name: 'Overlast in de openbare ruimte',
      slug: 'overlast-in-de-openbare-ruimte',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/auto-scooter-bromfietswrak',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display:
            'Auto- / scooter- / bromfiets(wrak) (Overlast in de openbare ruimte)',
          name: 'Auto- / scooter- / bromfiets(wrak)',
          slug: 'auto-scooter-bromfietswrak',
          handling: 'A3WMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Het wrak van een auto, scooter of bromfiets.',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: 'Wrakken op straat',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/bouw-sloopoverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Bouw- / sloopoverlast (Overlast in de openbare ruimte)',
          name: 'Bouw- / sloopoverlast',
          slug: 'bouw-sloopoverlast',
          handling: 'A3WMC',
          departments: [
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/deelfiets',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Deelfiets (Overlast in de openbare ruimte)',
          name: 'Deelfiets',
          slug: 'deelfiets',
          handling: 'A3WMC',
          departments: [],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: 'Deelfietsen',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/fietswrak',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Fietswrak (Overlast in de openbare ruimte)',
          name: 'Fietswrak',
          slug: 'fietswrak',
          handling: 'A3WMC',
          departments: [
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/graffiti-wildplak',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Graffiti / wildplak (Overlast in de openbare ruimte)',
          name: 'Graffiti / wildplak',
          slug: 'graffiti-wildplak',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hinderlijk-geplaatst-object',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display:
            'Hinderlijk geplaatst object (Overlast in de openbare ruimte)',
          name: 'Hinderlijk geplaatst object',
          slug: 'hinderlijk-geplaatst-object',
          handling: 'I5DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/lozing-dumping-bodemverontreiniging',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display:
            'Lozing / dumping / bodemverontreiniging (Overlast in de openbare ruimte)',
          name: 'Lozing / dumping / bodemverontreiniging',
          slug: 'lozing-dumping-bodemverontreiniging',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/markten',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Markten (Overlast in de openbare ruimte)',
          name: 'Markten',
          slug: 'markten',
          handling: 'HANDLING_MARKTEN',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'blah',
          handling_message:
            'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen drie dagen af. Als u een mailadres hebt opgegeven, zullen we u op de hoogte houden.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Overig openbare ruimte (Overlast in de openbare ruimte)',
          name: 'Overig openbare ruimte',
          slug: 'overig-openbare-ruimte',
          handling: 'A3WMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Parkeeroverlast (Overlast in de openbare ruimte)',
          name: 'Parkeeroverlast',
          slug: 'parkeeroverlast',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/stank-geluidsoverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Stank- / geluidsoverlast (Overlast in de openbare ruimte)',
          name: 'Stank- / geluidsoverlast',
          slug: 'stank-geluidsoverlast',
          handling: 'A3WMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
            {
              code: 'VTH',
              name: 'VTH',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Uitwerpselen (Overlast in de openbare ruimte)',
          name: 'Uitwerpselen',
          slug: 'hondenpoep',
          handling: 'A3WMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/wegsleep',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-in-de-openbare-ruimte/openbare_ruimte.svg?temp_url_sig=e611eec066fd9b1c7b419deb4549fec434197271b9c643eb60133025f9984da5&temp_url_expires=1665401495',
            },
          },
          _display: 'Wegsleep (Overlast in de openbare ruimte)',
          name: 'Wegsleep',
          slug: 'wegsleep',
          handling: 'A3WMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
        },
      },
      _display: 'Overlast op het water',
      name: 'Overlast op het water',
      slug: 'overlast-op-het-water',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/blokkade-van-de-vaarweg',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Blokkade van de vaarweg (Overlast op het water)',
          name: 'Blokkade van de vaarweg',
          slug: 'blokkade-van-de-vaarweg',
          handling: 'STOPEC3',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: 'dit is een omschrijving',
          handling_message:
            'Gevaarlijke situaties pakken wij zo snel mogelijk op. We laten u binnen 3 werkdagen weten wat we hebben gedaan. We houden u op de hoogte via e-mail.',
          public_name: 'Vaarweg geblokkeerd',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-geluid',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Geluid op het water (Overlast op het water)',
          name: 'Geluid op het water',
          slug: 'overlast-op-het-water-geluid',
          handling: 'WS1EC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.\n\nBlijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.',
          public_name: 'Feestje',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/scheepvaart-nautisch-toezicht',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Nautisch toezicht / vaargedrag (Overlast op het water)',
          name: 'Nautisch toezicht / vaargedrag',
          slug: 'scheepvaart-nautisch-toezicht',
          handling: 'WS3EC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.\n\nAls er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/olie-op-het-water',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Olie op het water (Overlast op het water)',
          name: 'Olie op het water',
          slug: 'olie-op-het-water',
          handling: 'STOPEC3',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Gevaarlijke situaties pakken wij zo snel mogelijk op. We laten u binnen 3 werkdagen weten wat we hebben gedaan. We houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overig-boten',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Overige boten (Overlast op het water)',
          name: 'Overige boten',
          slug: 'overig-boten',
          handling: 'WS3EC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.\n\nAls er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).\n',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-vaargedrag',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display:
            'Overlast op het water - Vaargedrag (Overlast op het water)',
          name: 'Overlast op het water - Vaargedrag',
          slug: 'overlast-op-het-water-vaargedrag',
          handling: 'WS1EC',
          departments: [],
          is_active: true,
          description: '',
          handling_message:
            'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.\n\nBlijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-vanaf-het-water',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Overlast vanaf het water (Overlast op het water)',
          name: 'Overlast vanaf het water',
          slug: 'overlast-vanaf-het-water',
          handling: 'WS1EC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.\n\nBlijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-snel-varen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Snel varen (Overlast op het water)',
          name: 'Snel varen',
          slug: 'overlast-op-het-water-snel-varen',
          handling: 'WS1EC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.\n\nBlijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-gezonken-boot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-op-het-water/boten.svg?temp_url_sig=000b99761f3b98215c5a3596ad3cc55c3fe8e3633540fd2b778f2d12c92cac9b&temp_url_expires=1665401495',
            },
          },
          _display: 'Wrak in het water (Overlast op het water)',
          name: 'Wrak in het water',
          slug: 'overlast-op-het-water-gezonken-boot',
          handling: 'WS2EC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.\n\nAls er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).\n\nBekijk in welke situaties we een wrak weghalen. Boten die vol met water staan, maar nog wél drijven, mogen we bijvoorbeeld niet weghalen.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
        },
      },
      _display: 'Overlast van dieren',
      name: 'Overlast van dieren',
      slug: 'overlast-van-dieren',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Dode dieren (Overlast van dieren)',
          name: 'Dode dieren',
          slug: 'dode-dieren',
          handling: 'A3DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Duiven (Overlast van dieren)',
          name: 'Duiven',
          slug: 'duiven',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
            {
              code: 'STL',
              name: 'Stadsloket',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Duiven duiven en nog eens duiven in de servicebelofte. !één twryÿ',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Ganzen (Overlast van dieren)',
          name: 'Ganzen',
          slug: 'ganzen',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail. GEES',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/meeuwen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Meeuwen (Overlast van dieren)',
          name: 'Meeuwen',
          slug: 'meeuwen',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/overig-dieren',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Overig dieren (Overlast van dieren)',
          name: 'Overig dieren',
          slug: 'overig-dieren',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ratten',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Ratten (Overlast van dieren)',
          name: 'Ratten',
          slug: 'ratten',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ratten-in-en-rond-woning',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Ratten – in en rond een woning (Overlast van dieren)',
          name: 'Ratten – in en rond een woning',
          slug: 'ratten-in-en-rond-woning',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description:
            'De GGD adviseert particulieren over de bestrijding en voert de werkzaamheden uit bij rattenoverlast in en rond woningen of tuinen. Rattenoverlast in de openbare ruimte (waaronder binnentuinen, straten en pleinen) moeten in de daarvoor bedoelde categorie worden geplaatst.',
          handling_message:
            'Wij laten u binnen 5 werkdagen weten wat wij met uw melding gaan doen. Wij melden u ook wanneer we dat gaan doen. Dit doen we via e-mail, als u een mailadres hebt opgegeven.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/wespen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-dieren/dieren.svg?temp_url_sig=160c5847e2f969850ebc1dbb264683712768e61830d3ed44bafa63ae47c715ee&temp_url_expires=1665401495',
            },
          },
          _display: 'Wespen (Overlast van dieren)',
          name: 'Wespen',
          slug: 'wespen',
          handling: 'I5DMC',
          departments: [
            {
              code: 'GGD',
              name: 'GGD',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
        },
      },
      _display: 'Overlast van en door personen of groepen',
      name: 'Overlast van en door personen of groepen',
      slug: 'overlast-van-en-door-personen-of-groepen',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/daklozen-bedelen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Daklozen / bedelen (Overlast van en door personen of groepen)',
          name: 'Daklozen / bedelen',
          slug: 'daklozen-bedelen',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Overlast van zwerver',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/drank-en-drugsoverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Drank- / drugsoverlast (Overlast van en door personen of groepen)',
          name: 'Drank- / drugsoverlast',
          slug: 'drank-en-drugsoverlast',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/jongerenoverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Jongerenoverlast (Overlast van en door personen of groepen)',
          name: 'Jongerenoverlast',
          slug: 'jongerenoverlast',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/loslopende-agressieve-honden',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Loslopende agressieve honden (Overlast van en door personen of groepen)',
          name: 'Loslopende agressieve honden',
          slug: 'loslopende-agressieve-honden',
          handling: 'EMPTY',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'AEG',
              name: 'Afval en Grondstoffen',
              is_intern: true,
            },
            {
              code: 'AB',
              name: 'Amsterdamse Bos',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Overlast loslopende/agressieve honden',
          handling_message:
            'Wij gaan aan het werk met uw melding. Als het dringend is komen we direct in actie. U hoort binnen 3 werkdagen wat wij hebben gedaan.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Overige overlast door personen (Overlast van en door personen of groepen)',
          name: 'Overige overlast door personen',
          slug: 'overige-overlast-door-personen',
          handling: 'REST',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overlast-door-afsteken-vuurwerk',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Overlast door afsteken vuurwerk (Overlast van en door personen of groepen)',
          name: 'Overlast door afsteken vuurwerk',
          slug: 'overlast-door-afsteken-vuurwerk',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overlast-van-taxis-bussen-en-fietstaxis',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            "Overlast van taxi's, bussen en fietstaxi's (Overlast van en door personen of groepen)",
          name: "Overlast van taxi's, bussen en fietstaxi's",
          slug: 'overlast-van-taxis-bussen-en-fietstaxis',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/personen-op-het-water',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Personen op het water (Overlast van en door personen of groepen)',
          name: 'Personen op het water',
          slug: 'personen-op-het-water',
          handling: 'A3DMC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/vuurwerkoverlast',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Vuurwerkoverlast (Overlast van en door personen of groepen)',
          name: 'Vuurwerkoverlast',
          slug: 'vuurwerkoverlast',
          handling: 'A3DMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/wildplassen-poepen-overgeven',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-van-en-door-personen-of-groepen/personen.svg?temp_url_sig=d2d05c8017456676d6f4b408d09c25243f44d21ac7220db180d0ef171ad71cd0&temp_url_expires=1665401495',
            },
          },
          _display:
            'Wildplassen / poepen / overgeven (Overlast van en door personen of groepen)',
          name: 'Wildplassen / poepen / overgeven',
          slug: 'wildplassen-poepen-overgeven',
          handling: 'A3DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/parent-category-0',
        },
      },
      _display: 'Parent category 0',
      name: 'Parent category 0',
      slug: 'parent-category-0',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/parent-category-0/sub_categories/category-0',
            },
          },
          _display: 'Category 0 (test via admin) (Parent category 0)',
          name: 'Category 0 (test via admin)',
          slug: 'category-0',
          handling: 'LIGHTING',
          departments: [],
          is_active: false,
          description: 'Category 0 (test via admin)',
          handling_message:
            'Test handling message (child category), test via admin',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/parent-category-1',
        },
      },
      _display: 'Parent category 1',
      name: 'Parent category 1',
      slug: 'parent-category-1',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/parent-category-1/sub_categories/category-1',
            },
          },
          _display: 'Category 1 (Parent category 1)',
          name: 'Category 1',
          slug: 'category-1',
          handling: 'I5DMC',
          departments: [],
          is_active: true,
          description: null,
          handling_message: 'Test handling message (child category)',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon',
        },
        'sia:icon': {
          href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
        },
      },
      _display: 'Schoon',
      name: 'Schoon',
      slug: 'schoon',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/drijfvuil-bevaarbaar-water',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Drijfvuil bevaarbaar water (Schoon)',
          name: 'Drijfvuil bevaarbaar water',
          slug: 'drijfvuil-bevaarbaar-water',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/drijfvuil-niet-bevaarbaar-water',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Drijfvuil niet-bevaarbaar water (Schoon)',
          name: 'Drijfvuil niet-bevaarbaar water',
          slug: 'drijfvuil-niet-bevaarbaar-water',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/gladheid-bladeren',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Gladheid door blad (Schoon)',
          name: 'Gladheid door blad',
          slug: 'gladheid-bladeren',
          handling: 'GLADZC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Bij gladheid door sneeuw of bladeren pakken we hoofdwegen en fietsroutes als eerste aan. Andere meldingen behandelen we als de belangrijkste routes zijn gedaan.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/gladheid-olie',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Gladheid door olie op de weg (Schoon)',
          name: 'Gladheid door olie op de weg',
          slug: 'gladheid-olie',
          handling: 'GLAD_OLIE',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Gaat het om gladheid door een ongeluk (olie of frituurvet op de weg)? Dan pakken we uw melding zo snel mogelijk op. In ieder geval binnen 3 werkdagen.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/gladheid-winterdienst',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Gladheid winterdienst (Schoon)',
          name: 'Gladheid winterdienst',
          slug: 'gladheid-winterdienst',
          handling: 'GLADZC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Bij gladheid door sneeuw of bladeren pakken we hoofdwegen en fietsroutes als eerste aan. Andere meldingen behandelen we als de belangrijkste routes zijn gedaan.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/graffitiwildplak',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Graffiti / wildplak (Schoon)',
          name: 'Graffiti / wildplak',
          slug: 'graffitiwildplak',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/onkruid-verharding',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Onkruid op verharding (Schoon)',
          name: 'Onkruid op verharding',
          slug: 'onkruid-verharding',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/prullenbak-kapot',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Prullenbak is kapot (Schoon)',
          name: 'Prullenbak is kapot',
          slug: 'prullenbak-kapot',
          handling: 'A3DEC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/prullenbak-vol',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Prullenbak is vol (Schoon)',
          name: 'Prullenbak is vol',
          slug: 'prullenbak-vol',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: 'Prullenbak is vol',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/putrioleringverstopt',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Put / riolering verstopt (Schoon)',
          name: 'Put / riolering verstopt',
          slug: 'putrioleringverstopt',
          handling: 'I5DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'CCA',
              name: 'CCA',
              is_intern: true,
            },
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/uitwerpselen',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Uitwerpselen (Schoon)',
          name: 'Uitwerpselen',
          slug: 'uitwerpselen',
          handling: 'A3WMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'We laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon/sub_categories/veegzwerfvuil',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
            },
          },
          _display: 'Veeg- / zwerfvuil (Schoon)',
          name: 'Veeg- / zwerfvuil',
          slug: 'veegzwerfvuil',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen vijf werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: true,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/test-van-david',
        },
      },
      _display: 'TEST VAN DAVID',
      name: 'TEST VAN DAVID',
      slug: 'test-van-david',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair',
        },
      },
      _display: 'Wegen, verkeer, straatmeubilair',
      name: 'Wegen, verkeer, straatmeubilair',
      slug: 'wegen-verkeer-straatmeubilair',
      public_name: null,
      is_public_accessible: true,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/autom-verzinkbare-palen',
            },
          },
          _display:
            'Autom. Verzinkbare palen (Wegen, verkeer, straatmeubilair)',
          name: 'Autom. Verzinkbare palen',
          slug: 'autom-verzinkbare-palen',
          handling: 'A3WEC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/bewegwijzering',
            },
          },
          _display: 'Bewegwijzering (Wegen, verkeer, straatmeubilair)',
          name: 'Bewegwijzering',
          slug: 'bewegwijzering',
          handling: 'A3WEC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'test',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: 'sdfsdf',
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/brug',
            },
          },
          _display: 'Brug (Wegen, verkeer, straatmeubilair)',
          name: 'Brug',
          slug: 'brug',
          handling: 'A3WEC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/camerasystemen',
            },
          },
          _display: 'Camerasystemen (Wegen, verkeer, straatmeubilair)',
          name: 'Camerasystemen',
          slug: 'camerasystemen',
          handling: 'A3WEC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/fietsrek-nietje',
            },
          },
          _display: 'Fietsrek / nietje (Wegen, verkeer, straatmeubilair)',
          name: 'Fietsrek / nietje',
          slug: 'fietsrek-nietje',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
            },
          },
          _display: 'Gladheid winterdienst (Wegen, verkeer, straatmeubilair)',
          name: 'Gladheid winterdienst',
          slug: 'gladheid',
          handling: 'GLADZC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Bij gladheid door sneeuw of bladeren pakken we hoofdwegen en fietsroutes als eerste aan. Andere meldingen behandelen we als de belangrijkste routes zijn gedaan.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/klok',
            },
          },
          _display: 'Klok (Wegen, verkeer, straatmeubilair)',
          name: 'Klok',
          slug: 'klok',
          handling: 'KLOKLICHTZC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties kunnen wat langer duren. Wij kunnen u hier helaas niet altijd van op de hoogte houden.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/lichthinder',
            },
          },
          _display: 'Lichthinder (Wegen, verkeer, straatmeubilair)',
          name: 'Lichthinder',
          slug: 'lichthinder',
          handling: 'STOPEC',
          departments: [],
          is_active: false,
          description: null,
          handling_message:
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties handelen wij meestal binnen 5 werkdagen af. U ontvangt dan geen apart bericht meer.\nAls we uw melding niet binnen 5 werkdagen kunnen afhandelen, hoort u - via e-mail – hoe wij uw melding oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/omleiding-belijning-verkeer',
            },
          },
          _display:
            'Omleiding / belijning verkeer (Wegen, verkeer, straatmeubilair)',
          name: 'Omleiding / belijning verkeer',
          slug: 'omleiding-belijning-verkeer',
          handling: 'A3WEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-fietspad',
            },
          },
          _display: 'Onderhoud fietspad (Wegen, verkeer, straatmeubilair)',
          name: 'Onderhoud fietspad',
          slug: 'onderhoud-fietspad',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Verzakkingen in/van fietspad, missende tegels, wortelopdruk in het fietspad, scheuren in fietspad',
          handling_message:
            'Wij handelen uw melding binnen een week af. Als u een mailadres hebt opgegeven, zullen we u op de hoogte houden.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-stoep-straat-en-fietspad',
            },
          },
          _display:
            'Onderhoud stoep, straat en fietspad (Wegen, verkeer, straatmeubilair)',
          name: 'Onderhoud stoep, straat en fietspad',
          slug: 'onderhoud-stoep-straat-en-fietspad',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Hieronder vallen alle meldingen van Onderhoud stoep, straat en fietspad.',
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/oplaadpunt',
            },
          },
          _display: 'Oplaadpunt (Wegen, verkeer, straatmeubilair)',
          name: 'Oplaadpunt',
          slug: 'oplaadpunt',
          handling: 'TECHNISCHE_STORING',
          departments: [
            {
              code: 'STL',
              name: 'Stadsloket',
              is_intern: true,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Technische storingen worden meestal automatisch gemeld en binnen enkele dagen opgelost. Het beantwoorden van vragen kan tot drie weken duren. We houden u op de hoogte via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/overig-wegen-verkeer-straatmeubilair',
            },
          },
          _display:
            'Overig Wegen, verkeer, straatmeubilair (Wegen, verkeer, straatmeubilair)',
          name: 'Overig Wegen, verkeer, straatmeubilair',
          slug: 'overig-wegen-verkeer-straatmeubilair',
          handling: 'REST',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
          public_name: 'Overig Wegen, verkeer, straatmeubilair',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/parkeer-verwijssysteem',
            },
          },
          _display: 'Parkeer verwijssysteem (Wegen, verkeer, straatmeubilair)',
          name: 'Parkeer verwijssysteem',
          slug: 'parkeer-verwijssysteem',
          handling: 'A3WEC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/parkeerautomaten',
            },
          },
          _display: 'Parkeerautomaten (Wegen, verkeer, straatmeubilair)',
          name: 'Parkeerautomaten',
          slug: 'parkeerautomaten',
          handling: 'I5DMC',
          departments: [
            {
              code: 'PRK',
              name: 'Parkeren',
              is_intern: false,
            },
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/prullenbakkapot',
            },
          },
          _display: 'Prullenbak is kapot (Wegen, verkeer, straatmeubilair)',
          name: 'Prullenbak is kapot',
          slug: 'prullenbakkapot',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/put-riool-kapot',
            },
          },
          _display: 'Put / Riool kapot (Wegen, verkeer, straatmeubilair)',
          name: 'Put / Riool kapot',
          slug: 'put-riool-kapot',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description:
            'Meldingen die betrekking hebben op een kapotte kolk en riolering.',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld.  Als u een mailadres hebt opgegeven, zullen we u op de hoogte houden.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/put-riolering-verstopt',
            },
          },
          _display:
            'Put / riolering verstopt (Wegen, verkeer, straatmeubilair)',
          name: 'Put / riolering verstopt',
          slug: 'put-riolering-verstopt',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
            {
              code: 'WAT',
              name: 'Waternet',
              is_intern: false,
            },
          ],
          is_active: false,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/speelplaats',
            },
          },
          _display: 'Speelplaats (Wegen, verkeer, straatmeubilair)',
          name: 'Speelplaats',
          slug: 'speelplaats',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/sportvoorziening',
            },
          },
          _display: 'Sportvoorziening (Wegen, verkeer, straatmeubilair)',
          name: 'Sportvoorziening',
          slug: 'sportvoorziening',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/stadsplattegronden',
            },
          },
          _display: 'Stadsplattegronden (Wegen, verkeer, straatmeubilair)',
          name: 'Stadsplattegronden',
          slug: 'stadsplattegronden',
          handling: 'A3WEC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatmeubilair',
            },
          },
          _display: 'Straatmeubilair (Wegen, verkeer, straatmeubilair)',
          name: 'Straatmeubilair',
          slug: 'straatmeubilair',
          handling: 'I5DMC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/lantaarnpaal-straatverlichting',
            },
            'sia:icon': {
              href: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/wegen-verkeer-straatmeubilair/lantaarnpaal-straatverlichting/grachtmast.svg?temp_url_sig=c26aad84e44d5533c5a7ac7583352128c7a72e42eed69b6bb21b4026ebeda71b&temp_url_expires=1665401495',
            },
          },
          _display: 'Straatverlichting (Wegen, verkeer, straatmeubilair)',
          name: 'Straatverlichting',
          slug: 'lantaarnpaal-straatverlichting',
          handling: 'LIGHTING',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: 'Dit is een tekst',
          handling_message:
            'Het herstellen van problemen met de openbare verlichting lukt doorgaans binnen 21 werkdagen. Bij gevaarlijke situaties wordt de melding meteen opgepakt.',
          public_name: 'Straatverlichting',
          is_public_accessible: true,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
            },
          },
          _display:
            'Straatverlichting / openbare klok (Wegen, verkeer, straatmeubilair)',
          name: 'Straatverlichting / openbare klok',
          slug: 'straatverlichting-openbare-klok',
          handling: 'KLOKLICHTZC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties kunnen wat langer duren. Wij kunnen u hier helaas niet altijd van op de hoogte houden.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/tijdelijke-verkeersmaatregelen',
            },
          },
          _display:
            'Tijdelijke Verkeersmaatregelenn (Wegen, verkeer, straatmeubilair)',
          name: 'Tijdelijke Verkeersmaatregelenn',
          slug: 'tijdelijke-verkeersmaatregelen',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: false,
          description: 'Test',
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.....',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verdeelkasten-bekabeling',
            },
          },
          _display:
            'Verdeelkasten / bekabeling (Wegen, verkeer, straatmeubilair)',
          name: 'Verdeelkasten / bekabeling',
          slug: 'verdeelkasten-bekabeling',
          handling: 'A3WEC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeersbord-verkeersafzetting',
            },
          },
          _display:
            'Verkeersbord / verkeersafzetting (Wegen, verkeer, straatmeubilair)',
          name: 'Verkeersbord / verkeersafzetting',
          slug: 'verkeersbord-verkeersafzetting',
          handling: 'A3DEC',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeerslicht',
            },
          },
          _display: 'Verkeerslicht (Wegen, verkeer, straatmeubilair)',
          name: 'Verkeerslicht',
          slug: 'verkeerslicht',
          handling: 'STOPEC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties handelen wij meestal binnen 5 werkdagen af. U ontvangt dan geen apart bericht meer.\nAls we uw melding niet binnen 5 werkdagen kunnen afhandelen, hoort u - via e-mail – hoe wij uw melding oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeersoverlast',
            },
          },
          _display: 'Verkeersoverlast (Wegen, verkeer, straatmeubilair)',
          name: 'Verkeersoverlast',
          slug: 'verkeersoverlast',
          handling: 'I5DMC',
          departments: [
            {
              code: 'ASC',
              name: 'Actie Service Centrum',
              is_intern: true,
            },
            {
              code: 'THO',
              name: 'THOR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeersoverlast-verkeerssituaties',
            },
          },
          _display:
            'Verkeersoverlast / Verkeerssituaties (Wegen, verkeer, straatmeubilair)',
          name: 'Verkeersoverlast / Verkeerssituaties',
          slug: 'verkeersoverlast-verkeerssituaties',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verkeerssituaties',
            },
          },
          _display: 'Verkeerssituaties (Wegen, verkeer, straatmeubilair)',
          name: 'Verkeerssituaties',
          slug: 'verkeerssituaties',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VOR',
              name: 'V&OR',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/verlichting-netstoring',
            },
          },
          _display: 'Verlichting netstoring (Wegen, verkeer, straatmeubilair)',
          name: 'Verlichting netstoring',
          slug: 'verlichting-netstoring',
          handling: 'STOPEC',
          departments: [],
          is_active: false,
          description: '',
          handling_message:
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties handelen wij meestal binnen 5 werkdagen af. U ontvangt dan geen apart bericht meer.\nAls we uw melding niet binnen 5 werkdagen kunnen afhandelen, hoort u - via e-mail – hoe wij uw melding oppakken.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/omleiding',
            },
          },
          _display: 'Wegwerkzaamheden (Wegen, verkeer, straatmeubilair)',
          name: 'Wegwerkzaamheden',
          slug: 'omleiding',
          handling: '3WGM',
          departments: [
            {
              code: 'STW',
              name: 'Stadswerken',
              is_intern: true,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
    {
      _links: {
        curies: {
          name: 'sia',
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
        },
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen',
        },
      },
      _display: 'Wonen',
      name: 'Wonen',
      slug: 'wonen',
      public_name: null,
      is_public_accessible: false,
      sub_categories: [
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/leegstand',
            },
          },
          _display: 'Leegstand (Wonen)',
          name: 'Leegstand',
          slug: 'leegstand',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/onderhuur-en-adreskwaliteit',
            },
          },
          _display: 'Onderhuur en adreskwaliteit (Wonen)',
          name: 'Onderhuur en adreskwaliteit',
          slug: 'onderhuur-en-adreskwaliteit',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/wonen-overig',
            },
          },
          _display: 'Overige Wonen (Wonen)',
          name: 'Overige Wonen',
          slug: 'wonen-overig',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description: null,
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/vakantieverhuur',
            },
          },
          _display: 'Vakantieverhuur (Wonen)',
          name: 'Vakantieverhuur',
          slug: 'vakantieverhuur',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/wonen-ondermijning',
            },
          },
          _display: 'Wonen ondermijning (Wonen)',
          name: 'Wonen ondermijning',
          slug: 'wonen-ondermijning',
          handling: 'EMPTY',
          departments: [
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description:
            'Criminele bewoning of activiteiten in een woning of woonboot, zoals een wietplantage of prostitutie.',
          handling_message:
            'U hoort binnen 10 werkdagen wat wij met uw melding gaan doen. En u hoort hoe lang het gaat duren.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/woningdelen-spookburgers',
            },
          },
          _display: 'Woningdelen / spookburgers (Wonen)',
          name: 'Woningdelen / spookburgers',
          slug: 'woningdelen-spookburgers',
          handling: 'I5DMC',
          departments: [
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/woningkwaliteit',
            },
          },
          _display: 'Woningkwaliteit (Wonen)',
          name: 'Woningkwaliteit',
          slug: 'woningkwaliteit',
          handling: 'I5DMC',
          departments: [
            {
              code: 'VTW',
              name: 'VTW',
              is_intern: false,
            },
            {
              code: 'WON',
              name: 'Wonen',
              is_intern: false,
            },
          ],
          is_active: true,
          description: '',
          handling_message:
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          public_name: null,
          is_public_accessible: false,
        },
        {
          _links: {
            curies: {
              name: 'sia',
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
            },
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen/sub_categories/fraude',
            },
          },
          _display: 'Woonfraude (Wonen)',
          name: 'Woonfraude',
          slug: 'fraude',
          handling: 'I5DMC',
          departments: [],
          is_active: false,
          description: '',
          handling_message: 'Test',
          public_name: null,
          is_public_accessible: false,
        },
      ],
    },
  ],
}
