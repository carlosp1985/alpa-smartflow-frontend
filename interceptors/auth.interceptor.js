/**
 * Interceptor de autenticación.
 *
 * Antes de cada petición HTTP:
 *  - Lee el token JWT almacenado en localStorage (clave: alpa_pos_token).
 *  - Si existe, lo agrega al encabezado Authorization como "Bearer <token>".
 *
 * En las respuestas:
 *  - Si el servidor responde con 401 o 403, se asume que la sesión expiró
 *    o no es válida. Se limpia la información del usuario y se redirige al login.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('AuthInterceptor', ['$q', '$window', '$location', function ($q, $window, $location) {

         return {
            request: function (config) {
               var token = $window.localStorage.getItem('alpa_pos_token');
               if (token) {
                  config.headers = config.headers || {};
                  config.headers.Authorization = 'Bearer ' + token;
               }
               return config;
            },

            responseError: function (response) {
               if (response && (response.status === 401 || response.status === 403)) {
                  $window.localStorage.removeItem('alpa_pos_token');
                  $window.localStorage.removeItem('alpa_pos_usuario');
                  $location.path('/login');
               }
               return $q.reject(response);
            }
         };

      }]);

})();

