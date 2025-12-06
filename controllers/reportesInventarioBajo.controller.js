(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('ReportesInventarioBajoController', ReportesInventarioBajoController);

   ReportesInventarioBajoController.$inject = ['$scope', 'ReportesService', 'NotificacionesService'];

   function ReportesInventarioBajoController($scope, ReportesService, NotificacionesService) {
      $scope.cargando = false;
      $scope.productos = [];

      inicializar();

      function inicializar() {
         $scope.cargando = true;
         ReportesService.getInventarioBajo()
            .then(function (data) {
               // getInventarioBajo devuelve un arreglo de productos
               $scope.productos = angular.isArray(data) ? data : [];
            })
            .catch(function () {
               NotificacionesService.error('Error al obtener el reporte de inventario bajo.');
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }
   }

})();
