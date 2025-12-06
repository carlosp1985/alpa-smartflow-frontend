/**
 * Servicio para la gestión de facturación electrónica.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('FacturacionService', FacturacionService);

   FacturacionService.$inject = ['$http', 'API_URL'];

   function FacturacionService($http, API_URL) {
      var servicio = {
         obtenerPorVenta: obtenerPorVenta,
         crearParaVenta: crearParaVenta,
         actualizarParaVenta: actualizarParaVenta
      };

      return servicio;

      function obtenerPorVenta(ventaId) {
         return $http.get(API_URL + '/facturacion/' + ventaId).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function crearParaVenta(ventaId, data) {
         return $http.post(API_URL + '/facturacion/' + ventaId, data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      function actualizarParaVenta(ventaId, data) {
         return $http.patch(API_URL + '/facturacion/' + ventaId, data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }
   }
})();
