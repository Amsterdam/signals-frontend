# Fixtures

## Intro

NOTE: This is a living document, renames still have to be done.

You could obtain `SIA_TOKEN` from your `Local Storage` after you logged in into `SIA` with your `ADW account`.

Set `$SIA_TOKEN`:

    SIA_TOKEN=YOUR_SIA_TOKEN_FROM_LOCAL_STORAGE:

You could also use the Chrome console to copy the `accessToken`:

    copy(localStorage.getItem('accessToken'))

Backend OpenAPI documentation:

    https://acc.api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/

## Proposals

### 'Consistent' import naming

This is kind of hard with those long file names...

```js
import privateRolesFixture from 'get-signals-v1-private-roles.json'
import inputRolesSelectorFixture form  selector-models-categories-selectors_inputRolesSelector.json
```

## Notes

Tests to fix:

  src/signals/settings/departments/Detail/components/CategoryLists/__tests__/CategoryLists.test.js
  src/signals/settings/departments/Detail/components/__tests__/mapCategories.test.js

Commands:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/' "Authorization:Bearer $SIA_TOKEN" | jq '.results[]  | select(.id == 2)'
    jq '.categories' department.json
    jq '.categories | length' department.json
    jq '.results[] | select(.id == 2)' departments.json

## HTTP Responses

### get-signals-v1-private-roles.json

Old Name: roles.json

Endpoint: signals/v1/private/roles/

Key: results

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/roles/' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > get-signals-v1-private-roles.json

### get-signals-v1-private-categories.json

Old Name: categories_private.json

Endpoint: signals/v1/private/categories/

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/' "Authorization:Bearer $SIA_TOKEN" | jq > get-signals-v1-private-categories.json

### get-signals-v1-private-departments.json

Old Name: departments.json

Endpoint: signals/v1/private/departments/

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/departments/' "Authorization:Bearer $SIA_TOKEN" | jq > get-signals-v1-private-departments.json

### get-signals-v1-private-users.json

Old Name: users.json

Endpoint: v1/private/users/

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/users/' "Authorization:Bearer $SIA_TOKEN" | jq > get-signals-v1-private-users.json

### get-signals-v1-private-users-id.json

Notes: This fixture is pretty fragile since it needs a specific set of permissions the issue is when
more then the required permissions are added (different type permissions) tests break badly

Old Name: user.json

Endpoint: v1/private/users/143

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/users/143' "Authorization:Bearer $SIA_TOKEN" | jq > get-signals-v1-private-users-id.json

### get-signals-v1-private-signals.json

Old Name: incidents.json

Endpoint: v1/private/signals

Key: results

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > get-signals-v1-private-signals.json

### get-signals-v1-private-signals-id.json

Old Name: incident.json

Endpoint: v1/private/signals/123

Key: results

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/123' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > get-signals-v1-private-signals-id.json

### get-signals-v1-private-categories-id.json

Old name: category.json

Endpoint: v1/private/categories/23

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/23' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > get-signals-v1-private-categories-id.json

### get-signals-v1-private-departments-id.json

Old name: department.json

Endpoint: v1/private/department/6

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/departments/6' "Authorization:Bearer $SIA_TOKEN" | jq > get-signals-v1-private-departments-id.json

### get-signals-v1-private-categories-id-history.json

Old name: history.json

Endpoint: v1/private/categories/23/history.json

Note: There is currently no history on acc

Example:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/23/history' "Authorization:Bearer $SIA_TOKEN" | jq '.results' > get-signals-v1-private-categories-id-history.json

### post-response-signals-v1-private-signals

Old Name: postIncident.json

Source: models/categories/selectors.js

### get-geosearch-bag-lat-ion-radius.json

Also used as (with different data): geosearch.json

Old Name: geography.json

Endpoint: geosearch/bag/?lat=52.37188789984033&lon=4.88888741680181&radius=50

Example:

    http 'https://acc.api.data.amsterdam.nl/geosearch/bag/?lat=52.37188789984033&lon=4.88888741680181&radius=50' "Authorization:Bearer $SIA_TOKEN" > get-geosearch-bag-lat-on-radius.json

## Selectors

### selector-models-categories-selectors_makeSelectStructuredCategories.json

Old Name: categories_structured.json

Source: models/categories/selectors.js

Selector: makeSelectStructuredCategories

List keys (categories):

    jq 'keys[]' categories_structured.json

Cheatsheet:

    jq '.results[] | select(.id == 2)' categories_structured.json

### selector-models-categories-selectors_inputRolesSelector.json

Old Name: inputRolesSelector.json

Source: models/categories/selectors.js

Selector: inputRolesSelector

## Other

### shared-services-map-location_formatPDOKResponse.json

Old Name: PDOKResponseData.json

Source: 'shared/services/map-location/index.js'

Method: formatPDOKResponse

Method Data Source:
    https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=gemeentenaam:amsterdam&fl=id,weergavenaam&fq=bron:BAG&fq=type:adres&fl=id,weergavenaam,straatnaam,huis_nlt,postcode,woonplaatsnaam,centroide_ll&q=Kal

#### kto.json

Type: Form data

Origin: unknown

Proposal: embed data into the related test

Related test: signals/incident/containers/KtoContainer/components/KtoForm/index.test.js

## Hooks

### hook-signals-settings-users-overview-useFetchUsers_FilterDataUseFetchUsers.json

Old Name: filteredUserData.json

Source: signals/settings/users/Overview/hooks/useFetchUsers.js

Method: signals/settings/filterData.js

## Unused/Deprecated (To be removed)

### priority.json

Is not being used

### service-shared-services-map-categories.json

Old name: categories.json

Source: shared/services/map-categories/index.js

Method: mapCategories

Method Input: get-signals-v1-private-categories.json

List keys (main, mainToSub, sub):

    jq 'keys[]' categories.json
    jq '.main' categories.json
    jq '.mainToSub' categories.json
    jq '.sub' categories.json
