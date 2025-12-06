/**
 * Servicio de inventario.
 *
 * Provee métodos para consultar movimientos y registrar ajustes
 * contra los endpoints de inventario del backend.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('InventarioService', InventarioService);

   InventarioService.$inject = ['$http', 'API_URL'];

   function InventarioService($http, API_URL) {
      var servicio = {
         getMovimientos: getMovimientos,
         crearAjuste: crearAjuste
      };

      return servicio;

      /**
       * Obtiene movimientos de inventario con filtros opcionales.
       *
       * @param {Object} filtros
       * @param {number|string} [filtros.producto_id]
       * @param {string} [filtros.tipo_movimiento]
       * @param {string} [filtros.fecha_inicio] - YYYY-MM-DD
       * @param {string} [filtros.fecha_fin] - YYYY-MM-DD
       */
      function getMovimientos(filtros) {
         filtros = filtros || {};

         return $http.get(API_URL + '/inventario/movimientos', {
            params: {
               producto_id: filtros.producto_id || undefined,
               tipo_movimiento: filtros.tipo_movimiento || undefined,
               fecha_inicio: filtros.fecha_inicio || undefined,
               fecha_fin: filtros.fecha_fin || undefined
            }
         }).then(function (response) {
            var data = response.data && response.data.data;
            return angular.isArray(data) ? data : [];
         });
      }

      /**
       * Registra un ajuste de inventario manual.
       *
       * @param {Object} ajuste
       * @param {number} ajuste.producto_id
       * @param {string} ajuste.tipo_movimiento - 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO'
       * @param {number} ajuste.cantidad
       * @param {string} [ajuste.nota]
       */
      function crearAjuste(ajuste) {
         return $http.post(API_URL + '/inventario/ajustes', ajuste)
            .then(function (response) {
               return response.data && response.data.data;
            });
      }
   }

})();

