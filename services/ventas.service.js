/**
 * Servicio para la gestión de ventas (POS y reportes).
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('VentasService', VentasService);

   VentasService.$inject = ['$http', 'API_URL'];

   function VentasService($http, API_URL) {
      var servicio = {
         crearVenta: crearVenta,
         listarVentas: listarVentas,
         obtenerVenta: obtenerVenta,
         anularVenta: anularVenta
      };

      return servicio;

      /**
       * Registra una venta completa.
       * @param {Object} data { cliente_id, medio_pago, items: [{producto_id, cantidad, porcentaje_descuento}], nota }
       */
      function crearVenta(data) {
         return $http.post(API_URL + '/ventas', data).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      /**
       * Lista ventas con filtros opcionales.
       */
      function listarVentas(filtros) {
         filtros = filtros || {};
         return $http.get(API_URL + '/ventas', {
            params: {
               fecha_inicio: filtros.fecha_inicio || '',
               fecha_fin: filtros.fecha_fin || '',
               estado: filtros.estado || ''
            }
         }).then(function (response) {
            return response.data && response.data.data ? response.data.data : [];
         });
      }

      /**
       * Obtiene una venta con sus detalles.
       */
      function obtenerVenta(id) {
         return $http.get(API_URL + '/ventas/' + id).then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }

      /**
       * Anula una venta existente.
       */
      function anularVenta(id) {
         return $http.post(API_URL + '/ventas/' + id + '/anular').then(function (response) {
            return response.data && response.data.data ? response.data.data : null;
         });
      }
   }
})();

