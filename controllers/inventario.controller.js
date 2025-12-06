/**
 * Controladores de inventario.
 *
 * Incluye:
 *  - InventarioMovimientosController: consulta de movimientos.
 *  - InventarioAjustesController: registro de ajustes manuales.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('InventarioMovimientosController', InventarioMovimientosController)
      .controller('InventarioAjustesController', InventarioAjustesController);

   InventarioMovimientosController.$inject = ['$scope', 'InventarioService', 'ProductosService', 'NotificacionesService'];
   InventarioAjustesController.$inject = ['$scope', 'InventarioService', 'ProductosService', 'NotificacionesService'];

   function InventarioMovimientosController($scope, InventarioService, ProductosService, NotificacionesService) {
      $scope.filtros = {
         producto_id: '',
         tipo_movimiento: '',
         fecha_inicio: obtenerFechaHoy(),
         fecha_fin: obtenerFechaHoy()
      };

      $scope.cargando = false;
      $scope.movimientos = [];
      $scope.productos = [];

      $scope.buscar = buscar;

      inicializar();

      function inicializar() {
         // Cargar lista básica de productos
         ProductosService.getProductos({ buscar: '', categoria_id: '' })
            .then(function (productos) {
               $scope.productos = productos || [];
            });

         buscar();
      }

      function buscar() {
         $scope.cargando = true;

         var filtros = angular.copy($scope.filtros);
         filtros.fecha_inicio = formatearFecha(filtros.fecha_inicio);
         filtros.fecha_fin = formatearFecha(filtros.fecha_fin);

         InventarioService.getMovimientos(filtros)
            .then(function (movimientos) {
               $scope.movimientos = movimientos || [];
            })
            .catch(function () {
               NotificacionesService.error('Error al obtener los movimientos de inventario.');
            })
            .finally(function () {
               $scope.cargando = false;
            });
      }

      function obtenerFechaHoy() {
         var hoy = new Date();
         var anio = hoy.getFullYear();
         var mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
         var dia = ('0' + hoy.getDate()).slice(-2);
         return anio + '-' + mes + '-' + dia;
      }

      function formatearFecha(valor) {
         if (!valor) return '';
         if (angular.isString(valor) && /^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
         var fecha = valor instanceof Date ? valor : new Date(valor);
         if (isNaN(fecha.getTime())) return '';
         var anio = fecha.getFullYear();
         var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
         var dia = ('0' + fecha.getDate()).slice(-2);
         return anio + '-' + mes + '-' + dia;
      }
   }

   function InventarioAjustesController($scope, InventarioService, ProductosService, NotificacionesService) {
      $scope.form = {
         producto_id: '',
         tipo_movimiento: '',
         cantidad: null,
         nota: ''
      };

      $scope.productos = [];

      $scope.guardar = guardar;
      $scope.resetFormulario = resetFormulario;

      inicializar();

      function inicializar() {
         ProductosService.getProductos({ buscar: '', categoria_id: '' })
            .then(function (productos) {
               $scope.productos = productos || [];
            });
      }

      function guardar() {
         if (!$scope.form.producto_id || !$scope.form.tipo_movimiento || !$scope.form.cantidad || $scope.form.cantidad <= 0) {
            NotificacionesService.info('Selecciona producto, tipo de ajuste y una cantidad mayor a cero.');
            return;
         }

         var payload = {
            producto_id: $scope.form.producto_id,
            tipo_movimiento: $scope.form.tipo_movimiento,
            cantidad: Number($scope.form.cantidad),
            nota: $scope.form.nota
         };

         InventarioService.crearAjuste(payload)
            .then(function () {
               NotificacionesService.exito('Ajuste de inventario registrado correctamente.');
               resetFormulario();
            })
            .catch(function (error) {
               var msg = (error && error.data && error.data.message) ? error.data.message : 'Error al registrar el ajuste de inventario.';
               NotificacionesService.error(msg);
            });
      }

      function resetFormulario() {
         $scope.form.producto_id = '';
         $scope.form.tipo_movimiento = '';
         $scope.form.cantidad = null;
         $scope.form.nota = '';
      }
   }

})();

