# Using local state in settings module

Date: 2020-03-11

## Status

Accepted

## Context

Some of the data that is required by the application is only needed in specific modules. Till now, `redux` has been relied on heavily and most of times for good reason. Some data, however, is only needed in specific parts of the application, but is still stored in the global store or is kept in a reducer on a per-component basis.

Different parts of the application have their own saga, reducer, actions and selectors which makes the application more difficult to understand, error prone and maintenance harder to keep up.

Storing all data in the global store requires a lot of (duplicate) boilerplate code, tests and mocking.

## Decision

The structure of the application's state needs to reflect the data that is globally required. If specific data is only needed in specific parts of the application, that application's part should provide the data through a reducer and a context provider and not make use of the global (`redux`) store.

Essentially, the entire application's state can be provided by a context provider, but for now we'll take the bottom-up approach and gradually refactor and introduce the reducer/context approach in favour of `redux` complexity.
