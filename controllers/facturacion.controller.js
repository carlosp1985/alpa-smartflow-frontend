/**
 * Controlador para la gestión de facturación electrónica de una venta.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('FacturacionController', FacturacionController);

   FacturacionController.$inject = ['$scope', '$routeParams', '$location', 'VentasService', 'FacturacionService', 'NotificacionesService'];

   function FacturacionController($scope, $routeParams, $location, VentasService, FacturacionService, NotificacionesService) {
      $scope.venta = null;
      $scope.facturacion = null;
      $scope.cargando = true;
      $scope.email_receptor = '';

      $scope.generarFactura = generarFactura;
      $scope.volver = function () {
         $location.path('/ventas/' + $routeParams.venta_id);
      };

      inicializar();

      function inicializar() {
         var ventaId = $routeParams.venta_id;

         VentasService.obtenerVenta(ventaId)
            .then(function (venta) {
               $scope.venta = venta;
               if (venta && venta.cliente && venta.cliente.email) {
                  $scope.email_receptor = venta.cliente.email;
               }
            })
            .catch(function () {
               NotificacionesService.error('No se pudo obtener la venta asociada.');
               $location.path('/ventas/historial');
            });

         FacturacionService.obtenerPorVenta(ventaId)
            .then(function (data) {
               $scope.facturacion = data;
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }

      function generarFactura() {
         if (!$scope.venta) {
            return;
         }

         var ventaId = $routeParams.venta_id;
         var payload = {
            email_receptor: $scope.email_receptor || null
         };

         FacturacionService.crearParaVenta(ventaId, payload)
            .then(function (registro) {
               $scope.facturacion = registro;
               NotificacionesService.exito('Factura electrónica generada correctamente.');
            })
            .catch(function (err) {
               var mensaje = (err && err.data && err.data.message) || 'No se pudo generar la factura electrónica.';
               NotificacionesService.error(mensaje);
            });
      }
   }
})();

