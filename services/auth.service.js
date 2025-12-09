/**
 * Servicio de autenticación para AlPa SmartFlow POS.
 *
 * Responsabilidades principales:
 *  - Realizar el proceso de login contra el backend.
 *  - Almacenar el token JWT y los datos básicos del usuario en localStorage.
 *  - Proveer métodos para saber si el usuario está autenticado.
 *  - Entregar los datos del usuario actual a otras partes de la aplicación.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('AuthService', AuthService);

   AuthService.$inject = ['$http', '$window', 'API_URL'];

   function AuthService($http, $window, API_URL) {
      var storageTokenKey = 'alpa_pos_token';
      var storageUserKey = 'alpa_pos_usuario';

      var servicio = {
         login: login,
         logout: logout,
         isAuthenticated: isAuthenticated,
         getCurrentUser: getCurrentUser
      };

      return servicio;

      /**
       * Realiza el login contra el endpoint de autenticación del backend.
       *
       * @param {string} username - Nombre de usuario o correo.
       * @param {string} password - Contraseña del usuario.
       * @returns {Promise} Promesa con la respuesta del servidor.
       */
      function login(username, password) {
         var payload = {
            username: username,
            password: password
         };

         return $http.post(API_URL + '/auth/login', payload)
            .then(function (response) {
               // El backend devuelve:
               // {
               //   ok: true,
               //   data: {
               //     token: '...',
               //     usuario: { id, nombre, apellido, email, rol }
               //   },
               //   message: '...'
               // }
               var data = response.data && response.data.data;
               if (data && data.token) {
                  $window.localStorage.setItem(storageTokenKey, data.token);

                  if (data.usuario) {
                     $window.localStorage.setItem(storageUserKey, JSON.stringify(data.usuario));
                  }
               }
               return response;
            });
      }

      /**
       * Cierra la sesión del usuario actual, eliminando token y datos asociados.
       */
      function logout() {
         $window.localStorage.removeItem(storageTokenKey);
         $window.localStorage.removeItem(storageUserKey);
      }

      /**
       * Indica si existe un token JWT almacenado.
       *
       * @returns {boolean} true si hay token, false en caso contrario.
       */
      function isAuthenticated() {
         return !!$window.localStorage.getItem(storageTokenKey);
      }

      /**
       * Devuelve los datos del usuario actual almacenados en localStorage.
       *
       * @returns {Object|null} Datos del usuario o null si no existe.
       */
      function getCurrentUser() {
         var usuarioJson = $window.localStorage.getItem(storageUserKey);
         if (!usuarioJson) {
            return null;
         }
         try {
            return JSON.parse(usuarioJson);
         } catch (e) {
            return null;
         }
      }
   }

})();

