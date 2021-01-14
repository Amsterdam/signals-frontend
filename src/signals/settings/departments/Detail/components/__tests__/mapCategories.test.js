import categories from 'utils/__tests__/fixtures/categories_structured.json';

import { incoming, outgoing } from '../mapCategories';
import { initialState } from '../CategoryLists/reducer';

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub);

describe('signals/settings/departments/Detail/components', () => {
  const departmentCategories = [
    {
      id: 293,
      category: {
        _links: {
          curies: {
            name: 'sia',
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
          },
          self: {
            href:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom-boomstob',
          },
        },
        _display: 'Boom - boomstob (Openbaar groen en water)',
        id: 131,
        name: 'Boom - boomstob',
        slug: 'boom-boomstob',
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
          '\nUw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
      },
      is_responsible: false,
      can_view: true,
    },
    {
      id: 312,
      category: {
        _links: {
          curies: {
            name: 'sia',
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
          },
          self: {
            href:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-glas-kapot',
          },
        },
        _display: 'Container glas kapot (Afval)',
        id: 132,
        name: 'Container glas kapot',
        slug: 'container-glas-kapot',
        handling: 'A3WMC',
        departments: [
          {
            code: 'AEG',
            name: 'Afval en Grondstoffen',
            is_intern: true,
          },
        ],
        is_active: true,
        description: null,
        handling_message:
          '\nWe laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
      },
      is_responsible: true,
      can_view: false,
    },
    {
      id: 331,
      category: {
        _links: {
          curies: {
            name: 'sia',
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
          },
          self: {
            href:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-glas-vol',
          },
        },
        _display: 'Container glas vol (Afval)',
        id: 133,
        name: 'Container glas vol',
        slug: 'container-glas-vol',
        handling: 'A3WMC',
        departments: [
          {
            code: 'AEG',
            name: 'Afval en Grondstoffen',
            is_intern: true,
          },
        ],
        is_active: true,
        description: null,
        handling_message:
          '\nWe laten u binnen 3 weken weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
      },
      is_responsible: true,
      can_view: true,
    },
  ];

  const getMatching = index =>
    subCategories.find(
      ({
        _links: {
          self: { public: publicUrl },
        },
      }) => publicUrl === departmentCategories[index].category._links.self.href
    );
  const boomstob = getMatching(0);
  const containerKapot = getMatching(1);
  const containerVol = getMatching(2);

  const expectedIncoming = {
    can_view: {
      'openbaar-groen-en-water': [{ ...boomstob, disabled: false }],
      afval: [{ ...containerVol, disabled: true }],
    },
    is_responsible: {
      'openbaar-groen-en-water': [],
      afval: [containerKapot, containerVol],
    },
  };

  it('should format incoming data', () => {
    expect(incoming([], subCategories)).toEqual(initialState);

    expect(incoming(departmentCategories, subCategories)).toEqual(expectedIncoming);

    const departmentCategoriesWithMismatch = [...departmentCategories];
    departmentCategoriesWithMismatch[0].category._links.self.href = 'foo bar';

    expect(incoming(departmentCategoriesWithMismatch, subCategories)).toEqual({
      can_view: {
        afval: [{ ...containerVol, disabled: true }],
      },
      is_responsible: {
        afval: [containerKapot, containerVol],
      },
    });
  });

  it('should format outgoing data', () => {
    const expectedOutgoing = {
      categories: [
        {
          category_id: 132,
          is_responsible: true,
        },
        {
          can_view: true,
          category_id: 131,
        },
        {
          can_view: true,
          category_id: 133,
          is_responsible: true,
        },
      ],
    };

    expect(outgoing(expectedIncoming)).toEqual(expectedOutgoing);
  });
});
