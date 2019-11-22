const routes = {
  users: '/instellingen/gebruikers',
  usersPaged: '/instellingen/gebruikers/page/:pageNum(\\d+)',
  user: '/instellingen/gebruiker/:userId(\\d+)?',
  roles: '/instellingen/rollen',
  rol: '/instellingen/rol/:userId(\\d+)',
};

export default routes;
