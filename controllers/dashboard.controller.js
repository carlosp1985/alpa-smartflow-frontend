/**
 * Controlador del dashboard principal.
 *
 * Muestra un resumen de:
 *  - Total de ventas del día.
 *  - Número de transacciones del día.
 *  - Cantidad de productos con inventario bajo.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('DashboardController', DashboardController);

   DashboardController.$inject = ['$scope', 'AuthService', 'ReportesService'];

   function DashboardController($scope, AuthService, ReportesService) {
      $scope.usuarioActual = AuthService.getCurrentUser();

      $scope.resumen = {
         totalVentasHoy: 0,
         cantidadTransaccionesHoy: 0,
         productosInventarioBajo: 0
      };

      $scope.cargando = true;

      inicializar();

      /**
       * Función de inicio del controlador.
       */
      function inicializar() {
         var hoy = obtenerFechaHoy();

         // Ventas del día
         ReportesService.getVentasPorFecha(hoy, hoy)
            .then(function (data) {
               // data = { ventas: [], resumen: { total_ventas, suma_total_neto } }
               var ventas = (data && data.ventas) || [];
               var resumen = (data && data.resumen) || {};

               if (angular.isArray(ventas)) {
                  $scope.resumen.cantidadTransaccionesHoy = ventas.length;
               } else {
                  $scope.resumen.cantidadTransaccionesHoy = 0;
               }

               if (resumen.suma_total_neto != null) {
                  $scope.resumen.totalVentasHoy = resumen.suma_total_neto;
               } else if (angular.isArray(ventas)) {
                  $scope.resumen.totalVentasHoy = ventas.reduce(function (acum, venta) {
                     var valor = venta.total_neto || venta.total || 0;
                     return acum + Number(valor);
                  }, 0);
               } else {
                  $scope.resumen.totalVentasHoy = 0;
               }
            })
            .finally(function () {
               $scope.cargando = false;
            });

         // Inventario bajo
         ReportesService.getInventarioBajo()
            .then(function (data) {
               if (angular.isArray(data)) {
                  $scope.resumen.productosInventarioBajo = data.length;
               }
            });
      }

      /**
       * Devuelve la fecha de hoy en formato YYYY-MM-DD.
       */
      function obtenerFechaHoy() {
         var hoy = new Date();
         var anio = hoy.getFullYear();
         var mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
         var dia = ('0' + hoy.getDate()).slice(-2);
         return anio + '-' + mes + '-' + dia;
      }
   }

})();

