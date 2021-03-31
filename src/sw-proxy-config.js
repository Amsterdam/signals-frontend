// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
/* eslint-disable no-unused-vars */
const me = {
  _links: {
    self: {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/users/47',
    },
  },
  _display: 'noreply@amsterdam.nl',
  id: 47,
  username: 'noreply@amsterdam.nl',
  email: 'noreply@amsterdam.nl',
  first_name: 'N. Reply',
  last_name: 'Amsterdam',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  roles: [
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/roles/1',
        },
      },
      _display: 'Monitor',
      id: 1,
      name: 'Monitor',
      permissions: [
        {
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/168',
            },
          },
          _display:
            'signals | category | View all categories (this will override the category permission based on the user/department relation)',
          id: 168,
          name:
            'View all categories (this will override the category permission based on the user/department relation)',
          codename: 'sia_can_view_all_categories',
        },
        {
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/110',
            },
          },
          _display: 'signals | signal | Can read from SIA',
          id: 110,
          name: 'Can read from SIA',
          codename: 'sia_read',
        },
        {
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/163',
            },
          },
          _display: 'signals | signal | Can create notes for signals',
          id: 163,
          name: 'Can create notes for signals',
          codename: 'sia_signal_create_note',
        },
        {
          _links: {
            self: {
              href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/111',
            },
          },
          _display: 'signals | signal | Can write to SIA',
          id: 111,
          name: 'Can write to SIA',
          codename: 'sia_write',
        },
      ],
    },
  ],
  permissions: [
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/10',
        },
      },
      _display: 'auth | groep | Can add group',
      id: 10,
      name: 'Can add group',
      codename: 'add_group',
    },
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/11',
        },
      },
      _display: 'auth | groep | Can change group',
      id: 11,
      name: 'Can change group',
      codename: 'change_group',
    },
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/40',
        },
      },
      _display: 'auth | groep | Can view group',
      id: 40,
      name: 'Can view group',
      codename: 'view_group',
    },
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/39',
        },
      },
      _display: 'auth | recht | Can view permission',
      id: 39,
      name: 'Can view permission',
      codename: 'view_permission',
    },
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/13',
        },
      },
      _display: 'auth | gebruiker | Can add user',
      id: 13,
      name: 'Can add user',
      codename: 'add_user',
    },
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/14',
        },
      },
      _display: 'auth | gebruiker | Can change user',
      id: 14,
      name: 'Can change user',
      codename: 'change_user',
    },
    {
      _links: {
        self: {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/permissions/41',
        },
      },
      _display: 'auth | gebruiker | Can view user',
      id: 41,
      name: 'Can view user',
      codename: 'view_user',
    },
  ],
  profile: {
    note: null,
    departments: [],
    created_at: '2019-10-24T10:25:48.874301+02:00',
    updated_at: '2019-10-24T10:25:48.874315+02:00',
  },
};

/**
 * Proxy configuration
 *
 * Each entry must have `request` and `response` properties.
 *
 * The following properties are allowed in the `request` property:
 * - `headers`: Object (optional), key/value pairs of HTTP headers
 * - `method`: String (required), HTTP method (GET, POST, PUT or DELETE)
 * - `url`: String (required), fully qualified URL of the request to be proxied. Can be a regexp.
 *
 * The following properties are allowed in the `response` property:
 * - `body`: Object/String (optional): response body
 * - `delay`: Number (optional): delay in milliseconds for the response to return
 * - `file`: String (optional), path to file to be served, relative to root folder of the application. Must be accessible to the web server and will be ignored if `body` is present
 * - `headers`: Object (optional), key/value pairs of HTTP headers
 * - `status`: Number (optional), HTTP status code
 * - `statusText`: String (optional), HTTP status text
 */
const proxyConfig = [
  {
    request: {
      url: 'https://geodata.nationaalgeoregister.nl/locatieserver/revgeo',
      method: 'GET',
    },
    response: {
      status: 500,
      statusText: 'Internal server error',
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><h1>Internal PDOK server error</h1></html>',
    },
  },
  {
    request: {
      url: 'https://api.data.amsterdam.nl/geosearch/bag',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    response: {
      status: 500,
      statusText: 'Internal server error',
      headers: {
        'Content-Type': 'text/html',
      },
      delay: 1000,
      body: '<html><h1>Internal BAG server error</h1></html>',
    },
  },
  {
    request: {
      url: 'https://acc.api.data.amsterdam.nl/signals/v1/private/me/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    response: {
      headers: {
        'Content-Type': 'application/json',
      },
      body: me,
    },
  },
];
