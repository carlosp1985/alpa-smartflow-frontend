(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('ReportesVentasFechasController', ReportesVentasFechasController);

   ReportesVentasFechasController.$inject = ['$scope', 'ReportesService', 'NotificacionesService'];

   function ReportesVentasFechasController($scope, ReportesService, NotificacionesService) {
      $scope.filtros = {
         fecha_inicio: obtenerFechaHoy(),
         fecha_fin: obtenerFechaHoy()
      };

      $scope.cargando = false;
      $scope.ventas = [];
      $scope.resumen = {};

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

         ReportesService.getVentasPorFecha(inicio, fin)
            .then(function (data) {
               // data puede venir como { ventas: [], resumen: { ... } }
               // o directamente como arreglo de ventas en algunos escenarios.
               var ventas = [];

               if (angular.isArray(data)) {
                  ventas = data;
                  $scope.resumen = {};
               } else {
                  ventas = (data && data.ventas) || [];
                  $scope.resumen = (data && data.resumen) || {};
               }

               $scope.ventas = ventas;

               // Si no viene resumen desde el backend, lo calculamos aquí.
               if (!$scope.resumen || Object.keys($scope.resumen).length === 0) {
                  var totalVentas = angular.isArray(ventas) ? ventas.length : 0;
                  var sumaTotalNeto = angular.isArray(ventas)
                     ? ventas.reduce(function (acc, v) {
                        return acc + Number(v.total_neto || v.total || 0);
                     }, 0)
                     : 0;

                  $scope.resumen = {
                     total_ventas: totalVentas,
                     suma_total_neto: sumaTotalNeto
                  };
               }
            })
            .catch(function () {
               NotificacionesService.error('Error al obtener el reporte de ventas por fecha.');
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

         // Si ya viene como string YYYY-MM-DD, se devuelve igual
         if (angular.isString(valor) && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            return valor;
         }

         // Si es Date u otro formato reconocible, se convierte a YYYY-MM-DD
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
