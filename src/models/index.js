// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import loadGlobalModel from 'containers/App/services'
import loadHistoryModel from './history'
import loadRolesModel from './roles'
import loadDepartmentsModel from './departments'
import loadCategoriesModel from './categories'

const loadModels = (store) => {
  loadHistoryModel(store)
  loadRolesModel(store)
  loadDepartmentsModel(store)
  loadCategoriesModel(store)
  loadGlobalModel(store)
}

export default loadModels
