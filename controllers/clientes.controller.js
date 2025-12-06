/**
 * Controladores para la gestión de clientes.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('ClientesListaController', ClientesListaController)
      .controller('ClienteFormController', ClienteFormController);

   ClientesListaController.$inject = ['$scope', '$location', 'ClientesService', 'NotificacionesService'];
   ClienteFormController.$inject = ['$scope', '$location', '$routeParams', 'ClientesService', 'NotificacionesService'];

   function ClientesListaController($scope, $location, ClientesService, NotificacionesService) {
      $scope.filtro = '';
      $scope.clientes = [];
      $scope.cargando = true;

      $scope.irNuevo = function () {
         $location.path('/clientes/nuevo');
      };

      $scope.editar = function (cliente) {
         $location.path('/clientes/' + cliente.id);
      };

      $scope.buscar = function () {
         cargarClientes();
      };

      cargarClientes();

      function cargarClientes() {
         $scope.cargando = true;
         ClientesService.getClientes($scope.filtro)
            .then(function (data) {
               $scope.clientes = data;
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }
   }

   function ClienteFormController($scope, $location, $routeParams, ClientesService, NotificacionesService) {
      $scope.cliente = {
         tipo_documento: 'CC',
         numero_documento: '',
         nombre: '',
         telefono: '',
         email: '',
         direccion: ''
      };

      $scope.esEdicion = !!$routeParams.id;
      $scope.titulo = $scope.esEdicion ? 'Editar cliente' : 'Nuevo cliente';

      if ($scope.esEdicion) {
         ClientesService.getCliente($routeParams.id)
            .then(function (data) {
               $scope.cliente = data;
            });
      }

      $scope.guardar = function () {
         if ($scope.formCliente.$invalid) {
            return;
         }

         var accion;
         if ($scope.esEdicion) {
            // El backend usa 'id' para los clientes
            accion = ClientesService.updateCliente($scope.cliente.id || $routeParams.id, $scope.cliente);
         } else {
            accion = ClientesService.createCliente($scope.cliente);
         }

         accion
            .then(function () {
               NotificacionesService.exito($scope.esEdicion ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.');
               $location.path('/clientes');
            })
            .catch(function () {
               NotificacionesService.error('No se pudo guardar el cliente.');
            });
      };

      $scope.cancelar = function () {
         $location.path('/clientes');
      };
   }

})();

