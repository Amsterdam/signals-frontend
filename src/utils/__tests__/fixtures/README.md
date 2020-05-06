# Fixtures

## Intro

You could obtain `SIA_TOKEN` from your `Local Storage` after you logged in into `SIA` with your `ADW account`.

Set `$SIA_TOKEN`:

    SIA_TOKEN=YOUR_SIA_TOKEN_FROM_LOCAL_STORAGE:

You could also use the Chrome console to copy the `accessToken`:

    copy(localStorage.getItem('accessToken'))

Backend OpenAPI documentation:

    https://acc.api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/

## Notes

Commands:

    http 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/' "Authorization:Bearer $SIA_TOKEN" | jq '.results[]  | select(.id == 2)'

    cat department.json | jq '.categories'
    cat department.json | jq '.categories | length'
    cat departments.json | jq '.results[]  | select(.id == 2)'

### Todo

kto.json: form data (origin unknown)

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

### get-geosearch-bag-lat-on-radius.json

Also Used As (with different data): geosearch.json
Old Name: geography.json
Endpoint: geosearch/bag/?lat=52.37188789984033&lon=4.88888741680181&radius=50

Example:

    http 'https://acc.api.data.amsterdam.nl/geosearch/bag/?lat=52.37188789984033&lon=4.88888741680181&radius=50' "Authorization:Bearer $SIA_TOKEN" >

## Selectors

### selector-models-categories-selectors.json

Old Name: categories.json
Source: models/categories/selectors.js

List keys (main, mainToSub, sub):

    jq 'keys[]' categories.json

## Services

### service-shared-services-map-categories.json

Old name: categories_structured.json
Source: shared/services/map-categories/index.js
Method: mapCategories
Method Input: get-signals-v1-private-categories.json

#### main


Selector: makeSelectMainCategories
Dump to screen: jq '.main' categories.json

#### mainToSub

Selector: makeSelectStructuredCategories
Dump to screen: jq '.mainToSub' categories.json

#### sub

Selector: makeSelectSubCategories
Dump to screen: jq '.sub' categories.json

### models-categories-selectors_inputRolesSelector.json

Old Name: inputRolesSelector.json
Source: models/categories/selectors.js
Selector: inputRolesSelector

## Other

### sharedServicesMapLocation_formatPDOK.json

Old Name: PDOKResponseData.json
Source: 'shared/services/map-location/index.js'
Method: formatPDOKResponse
Method Data Source:
    https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=gemeentenaam:amsterdam&fl=id,weergavenaam&fq=bron:BAG&fq=type:adres&fl=id,weergavenaam,straatnaam,huis_nlt,postcode,woonplaatsnaam,centroide_ll&q=Kal

### Hooks

#### signalsSettingsFilterDataUseFetchUsers.json

Old Name: filteredUserData.json
Source: signals/settings/users/Overview/hooks/useFetchUsers.js
Method: signals/settings/filterData.js

### Unused (To be removed)

rm priority.json
