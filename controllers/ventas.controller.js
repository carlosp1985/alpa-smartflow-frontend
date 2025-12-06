/**
 * Controlador para la pantalla de Caja (POS).
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('VentasCajaController', VentasCajaController);

   VentasCajaController.$inject = ['$scope', 'ProductosService', 'ClientesService', 'VentasService', 'NotificacionesService'];

   function VentasCajaController($scope, ProductosService, ClientesService, VentasService, NotificacionesService) {
      $scope.busquedaProducto = '';
      $scope.items = [];
      $scope.medio_pago = 'EFECTIVO';
      $scope.nota = '';

      $scope.clientes = [];
      $scope.cliente_id = '';

      $scope.productosBusqueda = [];

      $scope.total_bruto = 0;
      $scope.total_descuentos = 0;
      $scope.total_impuestos = 0;
      $scope.total_neto = 0;

      $scope.buscarProductos = buscarProductos;
      $scope.agregarProductoPorBusqueda = agregarProductoPorBusqueda;
      $scope.cambiarCantidad = cambiarCantidad;
      $scope.eliminarItem = eliminarItem;
      $scope.cobrar = cobrar;

      inicializar();

      function inicializar() {
         // Cargar algunos clientes para selección rápida (todos los que devuelva el backend con filtro vacío)
         ClientesService.getClientes('')
            .then(function (lista) {
               $scope.clientes = lista || [];
            });
      }

      function buscarProductos() {
         if (!$scope.busquedaProducto || $scope.busquedaProducto.length < 2) {
            $scope.productosBusqueda = [];
            return;
         }

         var filtros = { buscar: $scope.busquedaProducto, categoria_id: '' };
         ProductosService.getProductos(filtros)
            .then(function (productos) {
               $scope.productosBusqueda = productos || [];
            })
            .catch(function () {
               $scope.productosBusqueda = [];
               NotificacionesService.error('Error al buscar el producto.');
            });
      }

      function agregarProductoPorBusqueda(producto) {
         if (!producto) {
            if (!$scope.productosBusqueda.length) {
               NotificacionesService.info('No hay productos para agregar.');
               return;
            }
            producto = $scope.productosBusqueda[0];
         }

         var existente = $scope.items.find(function (i) { return i.producto.id === producto.id; });
         if (existente) {
            existente.cantidad += 1;
         } else {
            $scope.items.push({
               producto: producto,
               cantidad: 1,
               porcentaje_descuento: 0
            });
         }

         $scope.busquedaProducto = '';
         $scope.productosBusqueda = [];
         recalcularTotales();
      }

      function cambiarCantidad(item) {
         if (!item.cantidad || item.cantidad <= 0) {
            item.cantidad = 1;
         }
         recalcularTotales();
      }

      function eliminarItem(index) {
         $scope.items.splice(index, 1);
         recalcularTotales();
      }

      function recalcularTotales() {
         var totalBruto = 0;
         var totalDescuentos = 0;
         var totalImpuestos = 0;

         $scope.items.forEach(function (item) {
            var precio = Number(item.producto.precio_venta || 0);
            var cantidad = Number(item.cantidad || 0);
            var porcDesc = Number(item.porcentaje_descuento || 0);
            var ivaPorc = Number(item.producto.iva_porcentaje || 0);

            var subtotal = precio * cantidad;
            var montoDesc = (subtotal * porcDesc) / 100;
            var baseImponible = subtotal - montoDesc;
            var ivaMonto = (baseImponible * ivaPorc) / 100;

            totalBruto += subtotal;
            totalDescuentos += montoDesc;
            totalImpuestos += ivaMonto;

            item.subtotal = subtotal;
            item.total_linea = baseImponible + ivaMonto;
         });

         $scope.total_bruto = totalBruto;
         $scope.total_descuentos = totalDescuentos;
         $scope.total_impuestos = totalImpuestos;
         $scope.total_neto = totalBruto - totalDescuentos + totalImpuestos;
      }

      function cobrar() {
         if (!$scope.items.length) {
            NotificacionesService.info('Agrega al menos un producto antes de cobrar.');
            return;
         }

         var payload = {
            cliente_id: $scope.cliente_id || null,
            medio_pago: $scope.medio_pago,
            items: $scope.items.map(function (item) {
               return {
                  producto_id: item.producto.id,
                  cantidad: item.cantidad,
                  porcentaje_descuento: item.porcentaje_descuento || 0
               };
            }),
            nota: $scope.nota
         };

         VentasService.crearVenta(payload)
            .then(function () {
               NotificacionesService.exito('Venta registrada correctamente.');
               $scope.items = [];
               $scope.nota = '';
               $scope.medio_pago = 'EFECTIVO';
               recalcularTotales();
            })
            .catch(function (err) {
               var mensaje = (err && err.data && err.data.message) || 'No se pudo registrar la venta.';
               NotificacionesService.error(mensaje);
            });
      }
   }
})();

