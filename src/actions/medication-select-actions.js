/* eslint-disable import/prefer-default-export */

import * as types from './action-types';

/**
 * Sets the user input from the medication select input box
 * @param {*} input - User input string
 */
export function storeUserMedInput(input) {
  return {
    type: types.STORE_USER_MED_INPUT,
    input,
  };
}

/**
 * Sets the specific medication from the medication select input box
 * @param {*} medication - String of the medication ID
 */
export function storeUserChosenMedication(medication) {
  return {
    type: types.STORE_USER_CHOSEN_MEDICATION,
    medication,
  };
}

/**
 * Update the current FHIR MedicationOrder resource being built out based on the current FHIR version and patient ID
 * @param {*} fhirVersion - String of the FHIR version used in the context of the Sandbox
 * @param {*} patientId - String of the ID of the Patient resource in context
 */
export function updateFhirMedicationOrder(fhirVersion, patientId) {
  return {
    type: types.UPDATE_FHIR_MEDICATION_ORDER,
    fhirVersion,
    patientId,
  };
}

/**
 * Sets the specific condition code from the condition select input box
 * @param {*} condition - code value of the Condition coding part of the resource
 */
export function storeUserCondition(condition) {
  return {
    type: types.STORE_USER_CONDITION,
    condition,
  };
}

/**
 * Sets the medication amount and frequency set on the UI in the store
 * @param {*} amount - Dosage amount of the medication to take
 * @param {*} frequency - String dosage frequency of the medication
 */
export function storeMedDosageAmount(amount, frequency) {
  return {
    type: types.STORE_MED_DOSAGE_AMOUNT,
    amount,
    frequency,
  };
}

/**
 * Sets the date for the medication to be taken at a specific time (range)
 * @param {*} range - String stating the date is the 'start' or 'end' date
 * @param {*} date - String of the date
 */
export function storeDate(range, date) {
  return {
    type: types.STORE_DATE,
    range,
    date,
  };
}

/**
 * Toggle the start or end date so that it is either included or excluded from the MedicationOrder FHIR object in the request
 * @param {*} range - String stating the date is the 'start' or 'end' date
 */
export function toggleDate(range) {
  return {
    type: types.TOGGLE_DATE,
    range,
  };
}

/**
 * Takes action on the user-clicked suggestion from a card. The suggestion will be the suggestion chosen
 * from the CDS service response (exact format from specification).
 *
 * @param {*} suggestion - Object containing the suggestion chosen from the user (see format here: http://cds-hooks.org/specification/1.0/#suggestion)
 */
export function takeSuggestion(suggestion) {
  return {
    type: types.TAKE_SUGGESTION,
    suggestion,
  };
}
/**
 * Takes action on the messaging suggestion from the SMART app.
 *
 * @param {*} message - Object containing the scratchpad message suggestion chosen from the app (see format here: https://github.com/smart-on-fhir/smart-on-fhir.github.io/wiki/SMART-Web-Messaging#messagetype--scratchpad-fhir-api-interactions)
 */
export function takeMessageSuggestion(message) {
  return {
    type: types.TAKE_MESSAGE_SUGGESTION,
    message,
  };
}
