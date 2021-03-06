import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';

describe('Patient Retrieval', () => {
  let mockAxios;
  let axios;
  let actions;

  const fhirServer = 'http://mock-server.com/fhir';
  let mockStore = {};
  const expectedPatient = {};
  const expectedConditions = {};
  let retrievePatient;
  let defaultStore = {};
  console.error = jest.fn();

  function setMocksAndTestFunction(testStore) {
    const mockStoreWrapper = configureStore([]);
    mockStore = mockStoreWrapper(testStore);
    jest.setMock('../../src/store/store', mockStore);
    jest.mock('query-string');
    axios = require('axios').default;
    mockAxios = new MockAdapter(axios);
    retrievePatient = require('../../src/retrieve-data-helpers/patient-retrieval').default;
    actions = require('../../src/actions/patient-actions');
  }

  beforeEach(() => {
    expectedPatient.id = 'default-patient-id';
    expectedPatient.resourceType = 'Patient';
    expectedConditions.resourceType = 'Bundle';
    expectedConditions.id = 'conditions-123';
    defaultStore = {
      fhirServerState: {
        currentFhirServer: fhirServer,
      },
      patientState: {
        defaultPatientId: expectedPatient.id,
      },
    };
  });

  afterEach(() => {
    mockAxios.reset();
    mockStore.clearActions();
    jest.resetModules();
  });

  describe('When a patient resource GET call is successful', () => {
    it('resolves and dispatches a success action with patient from access token', () => {
      setMocksAndTestFunction(Object.assign({}, defaultStore, {
        fhirServerState: {
          ...defaultStore.fhirServerState,
          accessToken: {
            patient: 'access-token-patient-id',
          },
        },
      }));
      const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
      expectedPatient.id = mockStore.getState().fhirServerState.accessToken.patient;
      mockAxios.onGet(`${fhirServer}/Patient/${mockStore.getState().fhirServerState.accessToken.patient}`)
        .reply(200, expectedPatient);

      return retrievePatient().then(() => {
        expect(spy).toHaveBeenCalledWith(expectedPatient);
        spy.mockReset();
        spy.mockRestore();
      });
    });

    it('resolves and dispatches a success action with passed in patient', () => {
      setMocksAndTestFunction(defaultStore);
      const passedInPateintId = 'passed-id';
      mockAxios.onGet(`${fhirServer}/Patient/${passedInPateintId}`)
        .reply(200, expectedPatient);
      const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
      return retrievePatient(passedInPateintId).then(() => {
        expect(spy).toHaveBeenCalledWith(expectedPatient);
        spy.mockReset();
        spy.mockRestore();
      });
    });

    it('resolves and dispatches a success action with patient from localStorage', () => {
      const persistedPatientId = 'default-patient-id';
      localStorage.setItem('PERSISTED_patientId', persistedPatientId);
      setMocksAndTestFunction(defaultStore);
      mockAxios.onGet(`${fhirServer}/Patient/${persistedPatientId}`)
        .reply(200, expectedPatient);
      const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
      return retrievePatient().then(() => {
        expect(spy).toHaveBeenCalledWith(expectedPatient);
        spy.mockReset();
        spy.mockRestore();
      }); 
    });

    it('resolves and dispatches a success action with passed in patient despite access token patient being set', () => {
      setMocksAndTestFunction(Object.assign({}, defaultStore, {
        fhirServerState: {
          ...defaultStore.fhirServerState,
          accessToken: {
            patient: 'access-token-patient-id',
          },
        },
      }));
      const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
      const passedInPatientId = 'passed-id';
      mockAxios.onGet(`${fhirServer}/Patient/${passedInPatientId}`)
        .reply(200, expectedPatient);
      return retrievePatient(passedInPatientId).then(() => {
        expect(spy).toHaveBeenCalledWith(expectedPatient);
        spy.mockReset();
        spy.mockRestore();
      });
    });

    it('resolves and dispatches a success action with patient from window location', () => {
      setMocksAndTestFunction(defaultStore);
      mockAxios.onGet(`${fhirServer}/Patient/${expectedPatient.id}`)
        .reply(200, expectedPatient);
      const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
      return retrievePatient().then(() => {
        expect(spy).toHaveBeenCalledWith(expectedPatient);
        spy.mockReset();
        spy.mockRestore();
      });
    });

    describe('And a conditions fetch is successful', () => {
      it('resolves and dispatches a success action with patient/conditions', () => {
        setMocksAndTestFunction(defaultStore);
        const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
        mockAxios.onGet(`${fhirServer}/Patient/${expectedPatient.id}`)
          .reply(200, expectedPatient);
        mockAxios.onGet(`${fhirServer}/Condition?patient=${expectedPatient.id}`)
          .reply(200, expectedConditions);
        return retrievePatient().then(() => {
          expect(spy).toHaveBeenCalledWith(expectedPatient, expectedConditions);
          spy.mockReset();
          spy.mockRestore();
        });
      });
    });

    describe('And a conditions fetch is unsuccessful', () => {
      it('still resolves and dispatches a success action with patient', () => {
        setMocksAndTestFunction(defaultStore);
        const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
        mockAxios.onGet(`${fhirServer}/Patient/${expectedPatient.id}`)
          .reply(200, expectedPatient);
        mockAxios.onGet(`${fhirServer}/Condition?patient=${expectedPatient.id}`)
          .reply(404);
        return retrievePatient().then(() => {
          expect(spy).toHaveBeenCalledWith(expectedPatient);
          spy.mockReset();
          spy.mockRestore();
        });
      });
    });

    it('rejects the Promise and does not dispatch any actions for invalid Patient resource', () => {
      setMocksAndTestFunction(defaultStore);
      const spy = jest.spyOn(actions, 'signalSuccessPatientRetrieval');
      mockAxios.onGet('http://mock-server.com/fhir/Patient/default-patient-id')
        .reply(200, { foo: 'invalid' });

      return retrievePatient().catch(() => {
        expect(spy).not.toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });
    });
  });

  describe('When a patient resource GET call is unsuccessful', () => {
    it('rejects the Promise and dispatches a GET_PATIENT_FAILURE action', () => {
      setMocksAndTestFunction(defaultStore);
      const spy = jest.spyOn(actions, 'signalFailurePatientRetrieval');
      mockAxios.onGet('http://mock-server.com/fhir/Patient/default-patient-id').reply(500);
      return retrievePatient().catch(() => {
        expect(console.error).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });
    });
  });
});
