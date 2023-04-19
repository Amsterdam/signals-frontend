// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { CategoryDetail } from '../components'

export const DetailContainer = () => {
  return (
    <CategoryDetail
      isMainCategory={true}
      entityName="Hoofdcategorie"
      isPublicAccessibleLabel="Toon meldingen van deze hoofdcategorie op openbare kaarten en op de kaart in het meldformulier."
    />
  )
}

export default DetailContainer
