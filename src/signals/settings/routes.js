export const BASE_URL = '/instellingen';
export const USERS_URL = `${BASE_URL}/gebruikers`;
export const USERS_PAGED_URL = `${USERS_URL}/page`;
export const USER_URL = `${BASE_URL}/gebruiker`;
export const ROLES_URL = `${BASE_URL}/rollen`;
export const ROLE_URL = `${BASE_URL}/rol`;
export const DEPARTMENTS_URL = `${BASE_URL}/afdelingen`;
export const DEPARTMENT_URL = `${BASE_URL}/afdeling`;
export const CATEGORY_URL = `${BASE_URL}/categorie`;
export const CATEGORIES_URL = `${BASE_URL}/categorieen`;
export const CATEGORIES_PAGED_URL = `${CATEGORIES_URL}/page`;

const routes = {
  users: USERS_URL,
  usersPaged: `${USERS_PAGED_URL}/:pageNum(\\d+)`,
  user: `${USER_URL}/:userId(\\d+)`,

  roles: ROLES_URL,
  role: `${ROLE_URL}/:roleId(\\d+)`,

  departments: DEPARTMENTS_URL,
  department: `${DEPARTMENT_URL}/:departmentId(\\d+)`,

  categories: CATEGORIES_URL,
  categoriesPaged: `${CATEGORIES_PAGED_URL}/:pageNum(\\d+)`,
  category: `${CATEGORY_URL}/:categoryId(\\d+)`,
};

export default routes;
