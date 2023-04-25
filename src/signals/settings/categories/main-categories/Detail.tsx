// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
/* istanbul ignore file */
import { CategoryDetail } from '../components'

export const DetailContainer = () => (
  <CategoryDetail
    isMainCategory={true}
    entityName="Hoofdcategorie"
    isPublicAccessibleLabel="Toon meldingen van deze hoofdcategorie op openbare kaarten en op de kaart in het meldformulier."
  />
)

export default DetailContainer
