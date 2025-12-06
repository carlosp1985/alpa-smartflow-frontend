/**
 * Servicio para la gestión de categorías de productos.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('CategoriasService', CategoriasService);

   CategoriasService.$inject = ['$http', 'API_URL'];

   function CategoriasService($http, API_URL) {
      var servicio = {
         getCategorias: getCategorias,
         getCategoriaPorId: getCategoriaPorId,
         createCategoria: createCategoria,
         updateCategoria: updateCategoria,
         cambiarEstadoCategoria: cambiarEstadoCategoria
      };

      return servicio;

      function getCategorias() {
         return $http.get(API_URL + '/categorias').then(function (response) {
            // Backend: { ok, data: [...categorias], message }
            return response.data && response.data.data ? response.data.data : [];
         });
      }

      function getCategoriaPorId(id) {
         return $http.get(API_URL + '/categorias/' + id).then(function (response) {
            // Backend: { ok, data: {...categoria}, message }
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function createCategoria(data) {
         return $http.post(API_URL + '/categorias', data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function updateCategoria(id, data) {
         return $http.put(API_URL + '/categorias/' + id, data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function cambiarEstadoCategoria(id, activo) {
         return $http.patch(API_URL + '/categorias/' + id + '/estado', { activo: activo })
            .then(function (response) {
               return response.data && response.data.data ? response.data.data : null;
            });
      }
   }

})();

