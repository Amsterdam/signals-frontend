// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam

/*
 * These string are the matches for the different setting pages. You can use these in <Route> as paths. If you want to
 * navigate there, you have to prefix with BASE_URL.
 */
export const BASE_URL = `/instellingen`
export const OVERVIEW_URL = `${BASE_URL}`
export const USERS_URL = `gebruikers`
export const USERS_PAGED_URL = `${USERS_URL}/page`
export const USER_URL = `gebruiker`
export const ROLES_URL = `rollen`
export const ROLE_URL = `rol`
export const DEPARTMENTS_URL = `afdelingen`
export const DEPARTMENT_URL = `afdeling`
export const MAIN_CATEGORY_URL = `hoofdcategorie`
export const MAIN_CATEGORIES_URL = `hoofdcategorieen`
export const SUBCATEGORY_URL = `subcategorie`
export const SUBCATEGORIES_URL = `subcategorieen`
export const SUBCATEGORIES_PAGED_URL = `${SUBCATEGORIES_URL}/page`
export const EXPORT_URL = `export`

const routes = {
  overview: OVERVIEW_URL,
  users: USERS_URL,
  usersPaged: `${USERS_PAGED_URL}/:pageNum`,
  user: `${USER_URL}/:userId`,

  roles: ROLES_URL,
  role: `${ROLE_URL}/:roleId`,

  departments: DEPARTMENTS_URL,
  department: `${DEPARTMENT_URL}/:departmentId`,

  mainCategories: MAIN_CATEGORIES_URL,
  mainCategory: `${MAIN_CATEGORY_URL}/:categoryId`,

  subcategories: SUBCATEGORIES_URL,
  subcategory: `${SUBCATEGORY_URL}/:categoryId`,
  subcategoriesPaged: `${SUBCATEGORIES_PAGED_URL}/:pageNum`,

  export: EXPORT_URL,
}

export default routes
