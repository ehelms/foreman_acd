import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  APPLICATION_DEFINITION_INIT,
  APPLICATION_DEFINITION_SERVICE_DELETE,
  APPLICATION_DEFINITION_SERVICE_ADD,
  APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM,
  APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL,
  APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_CLOSE,
} from './ApplicationDefinitionConstants';

export const initialState = Immutable({
  name: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const applicationDefinitionConf = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case APPLICATION_DEFINITION_INIT: {
      return state.merge(payload);
    }
    case APPLICATION_DEFINITION_SERVICE_ADD: {
      let services = [];
      let index = 1;

      if ('services' in state && state.services !== undefined && state.services.length > 0) {
        services = cloneDeep(state.services);
        index = Math.max(...services.map(e => e.id)) + 1;
      }

      const newRow = {id: index, name: "", description: '', hostgroup: '', minCount: '', maxCount: '', parameters: [], newEntry: true };
      newRow.backup = cloneDeep(newRow)
      services.push(newRow);

      return state.merge({
        editMode: true,
        services: services
      });
    }
    case APPLICATION_DEFINITION_SERVICE_DELETE: {
      const services = state.services.filter(v => v.id !== payload.rowData.id);
      return state.merge({
        services: services,
      })
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index].backup = cloneDeep(services[index]);

      return state.merge({
        editMode: true,
        services: services
      });
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      delete services[index].backup;
      delete services[index].newEntry;

      return state.merge({
        editMode: false,
        services: services
      });
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index][payload.property] = payload.value;

      return state.set('services', services);
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index] = cloneDeep(services[index].backup);
      delete services[index].backup;

      if (services[index].newEntry === true) {
        services.splice(index, 1);
      }

      return state.merge({
        editMode: false,
        services: services
      });
    }
    case APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_OPEN: {
      let parametersData = {};

      if (payload && payload.rowData) {
        parametersData.serviceDefinition = {
          id: payload.rowData.id,
          name: payload.rowData.name,
          hostgroup_id: payload.rowData.hostgroup
        }
        parametersData.parameters = payload.rowData.parameters;

        if (parametersData.parameters.length > 0) {
          parametersData.mode = 'editDefinition';
        } else {
          parametersData.mode = 'newDefinition';
        }
      }

      return state.merge({
        isModalOpen: true,
        parametersData: parametersData,
      });
    }
    case APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_CLOSE: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: state.parametersData.serviceDefinition.id });
      services[index].parameters = cloneDeep(payload.serviceParameterSelection);

      return state.merge({
        isModalOpen: false,
        parametersData: null,
        services: services
      });
    }
    default:
      return state;
  }
};

export default applicationDefinitionConf;
