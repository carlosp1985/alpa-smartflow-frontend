/**
 * Controlador para el historial de ventas.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('VentasListaController', VentasListaController);

   VentasListaController.$inject = ['$scope', '$location', 'VentasService', 'NotificacionesService'];

   function VentasListaController($scope, $location, VentasService, NotificacionesService) {
      $scope.filtros = {
         fecha_inicio: '',
         fecha_fin: '',
         estado: ''
      };

      $scope.ventas = [];
      $scope.cargando = true;

      $scope.buscar = buscar;
      $scope.verDetalle = verDetalle;
      $scope.anularVenta = anularVenta;

      inicializar();

      function inicializar() {
         cargarVentas();
      }

      function buscar() {
         cargarVentas();
      }

      function cargarVentas() {
         $scope.cargando = true;
         VentasService.listarVentas($scope.filtros)
            .then(function (data) {
               $scope.ventas = data;
            })
            .catch(function () {
               NotificacionesService.error('No se pudieron obtener las ventas.');
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }

      function verDetalle(venta) {
         $location.path('/ventas/' + venta.id);
      }

      function anularVenta(venta) {
         if (venta.estado === 'ANULADA') {
            NotificacionesService.info('La venta ya está anulada.');
            return;
         }

         var confirmar = window.confirm('¿Seguro que deseas anular esta venta? Esta acción revertirá el stock de los productos.');
         if (!confirmar) {
            return;
         }

         VentasService.anularVenta(venta.id)
            .then(function () {
               NotificacionesService.exito('Venta anulada correctamente.');
               cargarVentas();
            })
            .catch(function (err) {
               var mensaje = (err && err.data && err.data.message) || 'No se pudo anular la venta.';
               NotificacionesService.error(mensaje);
            });
      }
   }
})();

