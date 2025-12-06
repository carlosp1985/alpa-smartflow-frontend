(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('ReportesVentasProductoController', ReportesVentasProductoController);

   ReportesVentasProductoController.$inject = ['$scope', 'ReportesService', 'NotificacionesService'];

   function ReportesVentasProductoController($scope, ReportesService, NotificacionesService) {
      $scope.filtros = {
         fecha_inicio: obtenerFechaHoy(),
         fecha_fin: obtenerFechaHoy()
      };

      $scope.cargando = false;
      $scope.productos = [];

      $scope.buscar = buscar;

      inicializar();

      function inicializar() {
         buscar();
      }

      function buscar() {
         if (!$scope.filtros.fecha_inicio || !$scope.filtros.fecha_fin) {
            NotificacionesService.info('Selecciona fecha inicio y fecha fin.');
            return;
         }

         $scope.cargando = true;

         var inicio = formatearFecha($scope.filtros.fecha_inicio);
         var fin = formatearFecha($scope.filtros.fecha_fin);

         ReportesService.getVentasPorProducto(inicio, fin)
            .then(function (data) {
               // El backend devuelve { productos: [...] }
               $scope.productos = (data && data.productos) || [];
            })
            .catch(function () {
               NotificacionesService.error('Error al obtener el reporte de ventas por producto.');
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }

      function obtenerFechaHoy() {
         var hoy = new Date();
         var anio = hoy.getFullYear();
         var mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
         var dia = ('0' + hoy.getDate()).slice(-2);
         return anio + '-' + mes + '-' + dia;
      }

      function formatearFecha(valor) {
         if (!valor) {
            return '';
         }

         if (angular.isString(valor) && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            return valor;
         }

         var fecha = valor instanceof Date ? valor : new Date(valor);
         if (isNaN(fecha.getTime())) {
            return '';
         }

         var anio = fecha.getFullYear();
         var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
         var dia = ('0' + fecha.getDate()).slice(-2);
         return anio + '-' + mes + '-' + dia;
      }
   }

})();
