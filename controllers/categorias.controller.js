/**
 * Controladores para la gestión de categorías.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('CategoriasListaController', CategoriasListaController)
      .controller('CategoriaFormController', CategoriaFormController);

   CategoriasListaController.$inject = ['$scope', '$location', 'CategoriasService', 'NotificacionesService'];
   CategoriaFormController.$inject = ['$scope', '$location', '$routeParams', 'CategoriasService', 'NotificacionesService'];

   function CategoriasListaController($scope, $location, CategoriasService, NotificacionesService) {
      $scope.categorias = [];
      $scope.cargando = true;

      $scope.irNueva = function () {
         $location.path('/categorias/nueva');
      };

      $scope.editar = function (categoria) {
         // Las categorías provenientes del backend usan _id como identificador
         $location.path('/categorias/' + (categoria.id || categoria._id));
      };

      $scope.cambiarEstado = function (categoria) {
         var nuevoEstado = !categoria.activo;
         // Asegurarse de enviar el identificador correcto al backend
         var categoriaId = categoria.id || categoria._id;
         CategoriasService.cambiarEstadoCategoria(categoriaId, nuevoEstado)
            .then(function () {
               categoria.activo = nuevoEstado;
               NotificacionesService.exito('Estado de la categoría actualizado.');
            })
            .catch(function () {
               NotificacionesService.error('No se pudo cambiar el estado de la categoría.');
            });
      };

      cargar();

      function cargar() {
         CategoriasService.getCategorias()
            .then(function (data) {
               $scope.categorias = data;
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }
   }

   function CategoriaFormController($scope, $location, $routeParams, CategoriasService, NotificacionesService) {
      $scope.categoria = {
         nombre: '',
         descripcion: '',
         activo: true
      };

      $scope.esEdicion = !!$routeParams.id;
      $scope.titulo = $scope.esEdicion ? 'Editar categoría' : 'Nueva categoría';

      if ($scope.esEdicion) {
         CategoriasService.getCategoriaPorId($routeParams.id)
            .then(function (data) {
               $scope.categoria = data;
            });
      }

      $scope.guardar = function () {
         if ($scope.formCategoria.$invalid) {
            return;
         }

         var accion;
         if ($scope.esEdicion) {
            // El backend puede enviar el identificador como id o _id
            var categoriaId = $scope.categoria.id || $scope.categoria._id || $routeParams.id;
            accion = CategoriasService.updateCategoria(categoriaId, $scope.categoria);
         } else {
            accion = CategoriasService.createCategoria($scope.categoria);
         }

         accion
            .then(function () {
               NotificacionesService.exito($scope.esEdicion ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.');
               $location.path('/categorias');
            })
            .catch(function () {
               NotificacionesService.error('No se pudo guardar la categoría.');
            });
      };

      $scope.cancelar = function () {
         $location.path('/categorias');
      };
   }

})();

