/**
 * Servicio para la gestión de usuarios.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('UsuariosService', UsuariosService);

   UsuariosService.$inject = ['$http', 'API_URL'];

   function UsuariosService($http, API_URL) {
      var servicio = {
         getUsuarios: getUsuarios,
         getUsuarioPorId: getUsuarioPorId,
         createUsuario: createUsuario,
         updateUsuario: updateUsuario,
         cambiarEstadoUsuario: cambiarEstadoUsuario
      };

      return servicio;

      function getUsuarios() {
         return $http.get(API_URL + '/usuarios').then(function (response) {
            // Backend responde { ok, data: { total, usuarios: [...] }, message }
            var payload = response.data && response.data.data;
            var lista = payload && payload.usuarios;
            return angular.isArray(lista) ? lista : [];
         });
      }

      function getUsuarioPorId(id) {
         return $http.get(API_URL + '/usuarios/' + id).then(function (response) {
            var data = response.data && response.data.data;
            // El backend devuelve un único usuario como objeto directo o dentro de data
            return data || {};
         });
      }

      function createUsuario(data) {
         return $http.post(API_URL + '/usuarios', data).then(function (response) {
            return response.data && response.data.data;
         });
      }

      function updateUsuario(id, data) {
         return $http.put(API_URL + '/usuarios/' + id, data).then(function (response) {
            return response.data && response.data.data;
         });
      }

      function cambiarEstadoUsuario(id, activo) {
         return $http.patch(API_URL + '/usuarios/' + id + '/estado', { activo: activo })
            .then(function (response) {
               return response.data && response.data.data;
            });
      }
   }

})();

