/**
 * Servicio de reportes.
 *
 * Provee métodos para obtener información agregada de ventas e inventario
 * desde el backend.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('ReportesService', ReportesService);

   ReportesService.$inject = ['$http', 'API_URL'];

   function ReportesService($http, API_URL) {
      var servicio = {
         getVentasPorFecha: getVentasPorFecha,
         getVentasPorProducto: getVentasPorProducto,
         getInventarioBajo: getInventarioBajo
      };

      return servicio;

      /**
       * Obtiene las ventas en un rango de fechas.
       *
       * @param {string} fechaInicio - Fecha inicial en formato YYYY-MM-DD.
       * @param {string} fechaFin - Fecha final en formato YYYY-MM-DD.
       */
      function getVentasPorFecha(fechaInicio, fechaFin) {
         return $http.get(API_URL + '/reportes/ventas-por-fecha', {
            params: {
               fecha_inicio: fechaInicio,
               fecha_fin: fechaFin
            }
         }).then(function (response) {
            // El backend devuelve { ok, data: { ventas: [], resumen: {} }, message }
            var data = response.data && response.data.data;
            if (!data) {
               data = { ventas: [], resumen: {} };
            }
            if (!angular.isArray(data.ventas)) {
               data.ventas = [];
            }
            if (!data.resumen) {
               data.resumen = {};
            }
            return data;
         });
      }

      /**
       * Obtiene las ventas agrupadas por producto en un rango de fechas.
       *
       * @param {string} fechaInicio - Fecha inicial en formato YYYY-MM-DD.
       * @param {string} fechaFin - Fecha final en formato YYYY-MM-DD.
       */
      function getVentasPorProducto(fechaInicio, fechaFin) {
         return $http.get(API_URL + '/reportes/ventas-por-producto', {
            params: {
               fecha_inicio: fechaInicio,
               fecha_fin: fechaFin
            }
         }).then(function (response) {
            // El backend devuelve { ok, data: { productos: [...] }, message }
            var data = response.data && response.data.data;
            if (!data) {
               data = { productos: [] };
            }
            if (!angular.isArray(data.productos)) {
               data.productos = [];
            }
            return data;
         });
      }

      /**
       * Obtiene la lista de productos con inventario bajo.
       */
      function getInventarioBajo() {
         return $http.get(API_URL + '/reportes/inventario-bajo')
            .then(function (response) {
               var payload = response.data && response.data.data;
               return angular.isArray(payload) ? payload : [];
            });
      }
   }

})();

