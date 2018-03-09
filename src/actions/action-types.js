/**
 * Redux Actions
 *
 * This file serves to define the action constants that reducers use to filter out what logic to perform.
 * There should be an action for every change to the Redux store. An action can possibly handle one of more
 * reducer pieces of logic (i.e. GET_FHIR_SERVER_FAILURE may prompt Reducer X to update state to show an error banner
 * at the top of the page AND prompt Reducer Y to update state to display a modal to prompt the user for another
 * FHIR server).
 *
 * See more here: https://redux.js.org/docs/basics/Actions.html
 *
 */

// FHIR Server
export const GET_FHIR_SERVER_SUCCESS = 'GET_FHIR_SERVER_SUCCESS';
export const GET_FHIR_SERVER_FAILURE = 'GET_FHIR_SERVER_FAILURE';