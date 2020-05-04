# Fixtures

## Intro

You could obtain `SIA_TOKEN` from your `Local Storage` after you logged in into `SIA` with your `ADW account`.

Set `$SIA_TOKEN`:

    SIA_TOKEN=YOUR_SIA_TOKEN_FROM_LOCAL_STORAGE

Backend OpenAPI documentation:

    https://acc.api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/

# Notes

## Todo
mv categories_structured.json models-categories-selectors_makeSelectStructuredCategories.json
mv postIncident.json postIncidentResponse.json
PDOKResponseData.json
department.json
geography.json
geosearch.json
kto.json (formdata (origin unknown))

## Backend Endpoints

### v1-private-roles.json

Old Name: roles.json
Endpoint: v1/private/roles/
Key: results

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/roles/' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > v1-private-roles.json

### v1-private-categories.json

Old Name: categories_private.json
Endpoint: v1/private/categories/

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/' "Authorization:Bearer $SIA_TOKEN" | jq > v1-private-categories.json

### v1-private-departments.json

Old Name: departments.json
Endpoint: v1/private/departments/

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/departments/' "Authorization:Bearer $SIA_TOKEN" | jq > v1-private-departments.json

### v1-private-users.json

Old Name: users.json
Endpoint: v1/private/users/

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/users/' "Authorization:Bearer $SIA_TOKEN" | jq > v1-private-users.json

### v1-private-users-id.json

Old Name: user.json
Endpoint: v1/private/users/143

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/users/143' "Authorization:Bearer $SIA_TOKEN" | jq > v1-private-users-id.json

### v1-private-signals.json

Old Name: incidents.json
Endpoint: v1/private/signals
Key: results
http 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > v1-private-signals.json

### v1-private-signals-id.json

Old Name: incident.json
Endpoint: v1/private/signals
Key: results

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > v1-private-signals.json

### v1-private-catgories-id.json

Old name: category.json
Endpoint: v1/private/categories/23

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/23' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > v1-private-catgories-id.json

### v1-private-catgories-id-history.json

Old name: history.json
Endpoint: v1/private/categories/23/history.json
Note: There is currently no history on acc

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/23/history' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > v1-private-catgories-id-history.json

## Selectors

### models-categories-selectors.json

Old Name: categories.json
Source: models/categories/selectors.js

List keys (main, mainToSub, sub):

    jq 'keys[]' < categories.json

#### main

Selector: makeSelectMainCategories

#### mainToSub

Selector: makeSelectStructuredCategories

#### sub

Selector: makeSelectSubCategories

### modelsCategoriesSelectorsInputRoles.json

Old Name: inputRolesSelector.json
Source: models/categories/selectors.js
Selector: inputRolesSelector

### Hooks

#### signalsSettingsFilterDataUseFetchUsers.json

Old Name: filteredUserData.json
Source: signals/settings/users/Overview/hooks/useFetchUsers.js
Method: signals/settings/filterData.js

### Unused (To be removed)

rm priority.json
