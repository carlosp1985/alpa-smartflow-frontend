/**
 * Controladores para la gestión de usuarios.
 *
 * UsuariosListaController: maneja la tabla de usuarios.
 * UsuarioFormController: maneja el formulario de creación/edición.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('UsuariosListaController', UsuariosListaController)
      .controller('UsuarioFormController', UsuarioFormController);

   UsuariosListaController.$inject = ['$scope', '$location', 'UsuariosService'];
   UsuarioFormController.$inject = ['$scope', '$location', '$routeParams', 'UsuariosService'];

   /**
    * Controlador de la lista de usuarios.
    */
   function UsuariosListaController($scope, $location, UsuariosService) {
      $scope.usuarios = [];
      $scope.cargando = true;

      $scope.irANuevo = function () {
         $location.path('/usuarios/nuevo');
      };

      $scope.editarUsuario = function (usuario) {
         $location.path('/usuarios/' + (usuario.id || usuario._id));
      };

      $scope.cambiarEstado = function (usuario) {
         var nuevoEstado = !usuario.activo;
         var id = usuario.id || usuario._id;
         UsuariosService.cambiarEstadoUsuario(id, nuevoEstado)
            .then(function () {
               usuario.activo = nuevoEstado;
            });
      };

      cargarUsuarios();

      function cargarUsuarios() {
         UsuariosService.getUsuarios()
            .then(function (data) {
               $scope.usuarios = data;
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }
   }

   /**
    * Controlador del formulario de usuario (creación/edición).
    */
   function UsuarioFormController($scope, $location, $routeParams, UsuariosService) {
      $scope.usuario = {
         nombre: '',
         apellido: '',
         email: '',
         username: '',
         password: '',
         rol: 'CAJERO',
         activo: true
      };

      $scope.esEdicion = !!$routeParams.id;
      $scope.titulo = $scope.esEdicion ? 'Editar usuario' : 'Nuevo usuario';

      if ($scope.esEdicion) {
         UsuariosService.getUsuarioPorId($routeParams.id)
            .then(function (data) {
               // Se asume que el backend devuelve las propiedades con los mismos nombres
               $scope.usuario = data;
            });
      }

      $scope.guardar = function () {
         if ($scope.formUsuario.$invalid) {
            return;
         }

         var accion;
         if ($scope.esEdicion) {
            var dataUpdate = angular.copy($scope.usuario);
            // No enviar contraseña vacía si no se quiere cambiar
            if (!dataUpdate.password) {
               delete dataUpdate.password;
            }
            accion = UsuariosService.updateUsuario($scope.usuario.id || $scope.usuario._id || $routeParams.id, dataUpdate);
         } else {
            accion = UsuariosService.createUsuario($scope.usuario);
         }

         accion.then(function () {
            $location.path('/usuarios');
         });
      };

      $scope.cancelar = function () {
         $location.path('/usuarios');
      };
   }

})();

