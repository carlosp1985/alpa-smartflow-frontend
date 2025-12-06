/**
 * Servicio para la gestión de clientes.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('ClientesService', ClientesService);

   ClientesService.$inject = ['$http', 'API_URL'];

   function ClientesService($http, API_URL) {
      var servicio = {
         getClientes: getClientes,
         getCliente: getCliente,
         createCliente: createCliente,
         updateCliente: updateCliente
      };

      return servicio;

      /**
       * Obtiene clientes aplicando un filtro de búsqueda opcional.
       * @param {string} filtro
       */
      function getClientes(filtro) {
         return $http.get(API_URL + '/clientes', {
            params: {
               buscar: filtro || ''
            }
         }).then(function (response) {
            // El backend devuelve { ok, data: { total, clientes, page, limit }, message }
            var payload = response.data && response.data.data;
            if (!payload || !payload.clientes) {
               return [];
            }
            return payload.clientes;
         });
      }

      function getCliente(id) {
         return $http.get(API_URL + '/clientes/' + id).then(function (response) {
            // El backend devuelve { ok, data: {...}, message }
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function createCliente(data) {
         return $http.post(API_URL + '/clientes', data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function updateCliente(id, data) {
         return $http.put(API_URL + '/clientes/' + id, data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }
   }

})();

