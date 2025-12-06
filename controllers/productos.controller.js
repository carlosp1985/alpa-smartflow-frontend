/**
 * Controladores para la gestión de productos.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('ProductosListaController', ProductosListaController)
      .controller('ProductoFormController', ProductoFormController);

   ProductosListaController.$inject = ['$scope', '$location', 'ProductosService', 'CategoriasService', 'NotificacionesService'];
   ProductoFormController.$inject = ['$scope', '$location', '$routeParams', 'ProductosService', 'CategoriasService', 'NotificacionesService'];

   function ProductosListaController($scope, $location, ProductosService, CategoriasService, NotificacionesService) {
      $scope.filtros = {
         buscar: '',
         categoria_id: ''
      };

      $scope.productos = [];
      $scope.categorias = [];
      $scope.cargando = true;

      $scope.irNuevo = function () {
         $location.path('/productos/nuevo');
      };

      $scope.editar = function (producto) {
         $location.path('/productos/' + producto.id);
      };

      $scope.cambiarEstado = function (producto) {
         var nuevoEstado = !producto.activo;
         ProductosService.cambiarEstadoProducto(producto.id, nuevoEstado)
            .then(function () {
               producto.activo = nuevoEstado;
               NotificacionesService.exito('Estado del producto actualizado.');
            })
            .catch(function () {
               NotificacionesService.error('No se pudo cambiar el estado del producto.');
            });
      };

      $scope.buscar = function () {
         cargarProductos();
      };

      inicializar();

      function inicializar() {
         CategoriasService.getCategorias().then(function (cats) {
            $scope.categorias = cats;
         });
         cargarProductos();
      }

      function cargarProductos() {
         $scope.cargando = true;
         ProductosService.getProductos($scope.filtros)
            .then(function (data) {
               $scope.productos = data;
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }
   }

   function ProductoFormController($scope, $location, $routeParams, ProductosService, CategoriasService, NotificacionesService) {
      $scope.producto = {
         codigo: '',
         nombre: '',
         descripcion: '',
         categoria_id: '',
         precio_venta: null,
         costo: null,
         iva_porcentaje: 0,
         stock_actual: 0,
         stock_minimo: 0,
         activo: true
      };

      $scope.categorias = [];
      $scope.esEdicion = !!$routeParams.id;
      $scope.titulo = $scope.esEdicion ? 'Editar producto' : 'Nuevo producto';

      CategoriasService.getCategorias().then(function (cats) {
         $scope.categorias = cats;
      });

      if ($scope.esEdicion) {
         ProductosService.getProducto($routeParams.id)
            .then(function (data) {
               if (data) {
                  if (data.precio_venta !== undefined && data.precio_venta !== null) {
                     data.precio_venta = Number(data.precio_venta);
                  }
                  if (data.costo !== undefined && data.costo !== null) {
                     data.costo = Number(data.costo);
                  }
                  $scope.producto = data;
               }
            });
      }

      $scope.guardar = function () {
         if ($scope.formProducto.$invalid) {
            return;
         }

         var accion;
         if ($scope.esEdicion) {
            // El backend usa 'id' (no '_id') para los productos
            accion = ProductosService.updateProducto($scope.producto.id || $routeParams.id, $scope.producto);
         } else {
            accion = ProductosService.createProducto($scope.producto);
         }

         accion
            .then(function () {
               NotificacionesService.exito($scope.esEdicion ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
               $location.path('/productos');
            })
            .catch(function () {
               NotificacionesService.error('No se pudo guardar el producto.');
            });
      };

      $scope.cancelar = function () {
         $location.path('/productos');
      };
   }

})();

