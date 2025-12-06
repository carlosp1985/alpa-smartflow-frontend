/**
 * Controlador de configuración general.
 *
 * Permite cargar y actualizar los parámetros generales del sistema
 * (datos del negocio, etc.).
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('ConfigController', ConfigController);

   ConfigController.$inject = ['$scope', 'ConfigService', 'NotificacionesService'];

   function ConfigController($scope, ConfigService, NotificacionesService) {
      $scope.config = {};
      $scope.cargando = true;

      $scope.guardar = guardar;

      inicializar();

      function inicializar() {
         ConfigService.obtenerConfiguracion()
            .then(function (data) {
               $scope.config = data || {};
            })
            .catch(function () {
               NotificacionesService.error('Error al cargar la configuración general.');
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }

      function guardar() {
         ConfigService.guardarConfiguracion($scope.config)
            .then(function () {
               NotificacionesService.exito('Configuración general guardada correctamente.');
            })
            .catch(function (error) {
               var msg = (error && error.data && error.data.message) ? error.data.message : 'Error al guardar la configuración.';
               NotificacionesService.error(msg);
            });
      }
   }

})();

