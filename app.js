/**
 * Módulo principal de la aplicación AlPa SmartFlow POS
 *
 * Todas las dependencias de módulos de terceros deben declararse aquí.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp', [
         'ngRoute'
      ])
      // Constante con la URL base del API REST
      .constant('API_URL', 'https://alpa-smartflow-backend-production.up.railway.app/api//')
      // Configuración del interceptor de autenticación
      .config(['$httpProvider', function ($httpProvider) {
         $httpProvider.interceptors.push('AuthInterceptor');
      }])
      // Ejecutado una vez que la app se inicializa
      .run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

         // Escucha de cambios de ruta para manejar redirecciones por autenticación
         $rootScope.$on('$routeChangeStart', function (event, next) {
            if (!next) return;

            var requiereAuth = next.requiresAuth;
            var soloInvitado = next.onlyGuest;
            var estaAutenticado = AuthService.isAuthenticated();

            // Rutas que requieren autenticación y el usuario no está autenticado
            if (requiereAuth && !estaAutenticado) {
               event.preventDefault();
               AuthService.logout();
               $location.path('/login');
               return;
            }

            // Si el usuario está autenticado y va al login, redirigir al dashboard
            if (soloInvitado && estaAutenticado) {
               event.preventDefault();
               $location.path('/dashboard');
            }
         });
      }]);

})();

