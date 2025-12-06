/**
 * Servicio para la gestión de productos.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('ProductosService', ProductosService);

   ProductosService.$inject = ['$http', 'API_URL'];

   function ProductosService($http, API_URL) {
      var servicio = {
         getProductos: getProductos,
         getProducto: getProducto,
         createProducto: createProducto,
         updateProducto: updateProducto,
         cambiarEstadoProducto: cambiarEstadoProducto
      };

      return servicio;

      /**
       * Obtiene la lista de productos con filtros opcionales.
       * @param {Object} filtros - { buscar: string, categoria_id: string }
       */
      function getProductos(filtros) {
         filtros = filtros || {};
         return $http.get(API_URL + '/productos', {
            params: {
               buscar: filtros.buscar || '',
               categoria_id: filtros.categoria_id || ''
            }
         }).then(function (response) {
            // Backend: { ok, data: [...productos], message }
            return response.data && response.data.data ? response.data.data : [];
         });
      }

      function getProducto(id) {
         return $http.get(API_URL + '/productos/' + id).then(function (response) {
            // Backend: { ok, data: {...producto}, message }
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function createProducto(data) {
         return $http.post(API_URL + '/productos', data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function updateProducto(id, data) {
         return $http.put(API_URL + '/productos/' + id, data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function cambiarEstadoProducto(id, activo) {
         return $http.patch(API_URL + '/productos/' + id + '/estado', { activo: activo })
            .then(function (response) {
               return response.data && response.data.data ? response.data.data : null;
            });
      }
   }

})();

