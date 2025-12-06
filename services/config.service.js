/**
 * Servicio de configuración.
 *
 * Provee métodos para obtener y guardar la configuración general
 * del sistema contra el backend.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('ConfigService', ConfigService);

   ConfigService.$inject = ['$http', 'API_URL', '$q'];

   function ConfigService($http, API_URL, $q) {
      var servicio = {
         obtenerConfiguracion: obtenerConfiguracion,
         guardarConfiguracion: guardarConfiguracion
      };

      return servicio;

      /**
       * Obtiene la configuración general.
       */
      function obtenerConfiguracion() {
         return $http.get(API_URL + '/config')
            .then(function (response) {
               // Se espera { ok, data, message }
               return response.data && response.data.data;
            });
      }

      /**
       * Guarda la configuración general.
       *
       * @param {Object} config
       */
      function guardarConfiguracion(config) {
         // El backend expone PUT /api/config/:clave con body { valor }
         var peticiones = [];

         angular.forEach(config, function (valor, clave) {
            peticiones.push(
               $http.put(API_URL + '/config/' + encodeURIComponent(clave), { valor: valor })
            );
         });

         return $q.all(peticiones).then(function (responses) {
            return responses;
         });
      }
   }

})();

