/**
 * Controlador de la pantalla de inicio de sesión.
 *
 * Maneja las credenciales del usuario y realiza el proceso de login
 * usando AuthService. Si el login es exitoso, redirige al dashboard;
 * en caso contrario, muestra un mensaje de error.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('LoginController', LoginController);

   LoginController.$inject = ['$scope', '$location', 'AuthService'];

   function LoginController($scope, $location, AuthService) {

      // Modelo de credenciales vinculadas al formulario
      $scope.credenciales = {
         username: '',
         password: ''
      };

      // Mensaje de error mostrado en la vista
      $scope.mensajeError = '';

      // Función expuesta para realizar el login
      $scope.login = function () {
         $scope.mensajeError = '';

         if (!$scope.credenciales.username || !$scope.credenciales.password) {
            $scope.mensajeError = 'Por favor, ingresa usuario y contraseña.';
            return;
         }

         AuthService.login($scope.credenciales.username, $scope.credenciales.password)
            .then(function () {
               // Login exitoso
               $location.path('/dashboard');
            })
            .catch(function (error) {
               // Error en autenticación
               if (error && error.data && error.data.mensaje) {
                  $scope.mensajeError = error.data.mensaje;
               } else {
                  $scope.mensajeError = 'Usuario o contraseña inválidos.';
               }
            });
      };
   }

})();

