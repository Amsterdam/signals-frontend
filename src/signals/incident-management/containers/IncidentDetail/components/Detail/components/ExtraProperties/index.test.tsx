// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'

import type { Item } from './types'
import ExtraProperties from '.'

describe('<ExtraProperties />', () => {
  const props = {
    items: [
      {
        id: 'extra_straatverlichting',
        label: 'Gaat uw melding over één of over meer lampen?',
        category_url:
          '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: {
          id: 'meer_lampen',
          label: 'Meer lampen',
        },
      },
      {
        id: 'extra_straatverlichting_nummer',
        label: 'Hebt u een nummer van (één van) de lamp(en)?',
        category_url:
          '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: '42',
      },
      {
        id: 'extra_bedrijven_vaker',
        label: 'Gebeurt het vaker?',
        category_url:
          '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: { label: 'Ja, het gebeurt vaker', value: false },
      },
      {
        id: 'extra_bedrijven_gezien',
        label: 'Heeft u het gezien?',
        category_url:
          '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: { label: 'Ja, het gebeurt vaker', value: true },
      },
      {
        id: 'lampen',
        label: 'Welke lampen?',
        category_url:
          '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: ['126543', '87654'],
      },
    ] as Item[],
  }

  it('should render correctly', () => {
    render(<ExtraProperties {...props} />)

    expect(screen.queryAllByTestId('extra-properties-definition')).toHaveLength(
      props.items.length
    )
    expect(screen.queryAllByTestId('extra-properties-value')).toHaveLength(
      props.items.length
    )

    expect(
      screen.queryAllByTestId('extra-properties-definition')[0]
    ).toHaveTextContent(/^Gaat uw melding over één of over meer lampen\?$/)
    expect(
      screen.queryAllByTestId('extra-properties-value')[0]
    ).toHaveTextContent(/^Meer lampen$/)
    expect(
      screen.queryAllByTestId('extra-properties-definition')[1]
    ).toHaveTextContent(/^Hebt u een nummer van \(één van\) de lamp\(en\)\?$/)
    expect(
      screen.queryAllByTestId('extra-properties-value')[1]
    ).toHaveTextContent(/^42$/)
    expect(
      screen.queryAllByTestId('extra-properties-definition')[2]
    ).toHaveTextContent(/^Gebeurt het vaker\?$/)
    expect(
      screen.queryAllByTestId('extra-properties-value')[2]
    ).toHaveTextContent(/^Nee$/)
    expect(
      screen.queryAllByTestId('extra-properties-definition')[3]
    ).toHaveTextContent(/^Heeft u het gezien\?$/)
    expect(
      screen.queryAllByTestId('extra-properties-value')[3]
    ).toHaveTextContent(/^Ja, het gebeurt vaker$/)
    expect(
      screen.queryAllByTestId('extra-properties-definition')[4]
    ).toHaveTextContent(/^Welke lampen\?$/)
    expect(
      screen.queryAllByTestId('extra-properties-value')[4]
    ).toHaveTextContent(/^126543/)
    expect(
      screen.queryAllByTestId('extra-properties-value')[4]
    ).toHaveTextContent(/87654$/)
  })

  it('should render correctly without items', () => {
    render(<ExtraProperties />)

    expect(screen.queryAllByTestId('extra-properties-definition')).toHaveLength(
      0
    )
    expect(screen.queryAllByTestId('extra-properties-value')).toHaveLength(0)
  })

  it('should handle container data format', () => {
    const items = [
      {
        id: 'extra_container',
        label: 'Container(s)',
        answer: [
          {
            id: 'PAA00069',
            type: 'Papier',
            description: 'Papier container',
          },
          {
            id: 'GLA00121',
            type: 'Glas',
            description: 'Glas container',
          },
          {
            id: 'PLA00004',
            type: 'Plastic',
            description: 'Plastic container',
          },
          {
            id: 'GLA00106',
            type: 'Glas',
            description: 'Glas container',
          },
          {
            id: 'PAA00114',
            type: 'Papier',
            description: 'Papier container',
          },
          {
            id: '',
            type: 'Onbekend',
            description: 'De container staat niet op de kaart',
          },
        ],
        category_url:
          '/signals/v1/public/terms/categories/afval/sub_categories/container-voor-papier-is-stuk',
      },
    ]

    render(<ExtraProperties items={items} />)

    expect(screen.queryAllByTestId('extra-properties-definition')).toHaveLength(
      Object.values(items).length
    )
    expect(screen.queryAllByTestId('extra-properties-value')).toHaveLength(
      Object.values(items).length
    )

    expect(screen.getByTestId('extra-properties-definition')).toHaveTextContent(
      /Container\(s\)/
    )
    expect(screen.getByTestId('extra-properties-value')).toHaveTextContent(
      /Papier container - PAA00069/
    )
    expect(screen.getByTestId('extra-properties-value')).toHaveTextContent(
      /De container staat niet op de kaart/
    )
  })

  it('should handle data with multiple answers', () => {
    const items = [
      {
        id: 'extra_bedrijven_horeca_terrassen',
        label: 'Oorzaak overlast',
        answer: [
          {
            id: 'uitgewaaierd_terras',
            label: 'Uitgewaaierd terras (buiten de toegestane grens)',
          },
          {
            id: 'doorloop',
            label: 'Het terras belemmert de doorloop',
          },
          {
            id: 'stoep_in_beslag',
            label:
              'Terras / terrasbezoekers nemen hele stoep in zodat u via de weg erlangs moet',
          },
          {
            id: 'bezoekers_op_straat',
            label: 'Bezoekers staan op straat',
          },
        ],
        category_url:
          '/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-terrassen',
      },
    ]

    render(<ExtraProperties items={items} />)

    expect(screen.queryAllByTestId('extra-properties-definition')).toHaveLength(
      Object.values(items).length
    )
    expect(screen.queryAllByTestId('extra-properties-value')).toHaveLength(
      Object.values(items).length
    )

    expect(screen.getByTestId('extra-properties-definition')).toHaveTextContent(
      /^Oorzaak overlast$/
    )
    expect(screen.getByTestId('extra-properties-value')).toHaveTextContent(
      /Uitgewaaierd terras \(buiten de toegestane grens\)/
    )
    expect(screen.getByTestId('extra-properties-value')).toHaveTextContent(
      /Het terras belemmert de doorloop/
    )
  })

  it('should be able to deal with legacy format', () => {
    const items = {
      'Op welke locatie ervaart u de overlast': 'In huis',
    }

    render(<ExtraProperties items={items} />)

    expect(screen.queryAllByTestId('extra-properties-definition')).toHaveLength(
      Object.values(items).length
    )
    expect(screen.queryAllByTestId('extra-properties-value')).toHaveLength(
      Object.values(items).length
    )

    expect(screen.getByTestId('extra-properties-definition')).toHaveTextContent(
      /^Op welke locatie ervaart u de overlast$/
    )
    expect(screen.getByTestId('extra-properties-value')).toHaveTextContent(
      /^In huis$/
    )
  })
})
