/**
 * Controlador para el detalle de una venta.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('VentaDetalleController', VentaDetalleController);

   VentaDetalleController.$inject = ['$scope', '$routeParams', '$location', 'VentasService', 'NotificacionesService'];

   function VentaDetalleController($scope, $routeParams, $location, VentasService, NotificacionesService) {
      $scope.venta = null;
      $scope.cargando = true;

      $scope.volver = function () {
         $location.path('/ventas/historial');
      };

      inicializar();

      function inicializar() {
         var id = $routeParams.id;
         VentasService.obtenerVenta(id)
            .then(function (data) {
               $scope.venta = data;
            })
            .catch(function () {
               NotificacionesService.error('No se pudo obtener el detalle de la venta.');
               $location.path('/ventas/historial');
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }
   }
})();

