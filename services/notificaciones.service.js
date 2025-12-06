(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .factory('NotificacionesService', NotificacionesService);

   NotificacionesService.$inject = [];

   function NotificacionesService() {
      return {
         exito: exito,
         error: error,
         info: info
      };

      function exito(mensaje) {
         mostrarToast(mensaje || 'Operación realizada correctamente.', 'green');
      }

      function error(mensaje) {
         mostrarToast(mensaje || 'Ocurrió un error. Inténtalo nuevamente.', 'red');
      }

      function info(mensaje) {
         mostrarToast(mensaje || 'Información', 'blue');
      }

      function mostrarToast(mensaje, color) {
         if (window.M && M.toast) {
            M.toast({
               html: mensaje,
               classes: color + ' darken-1',
               displayLength: 3000
            });
         } else {
            // Fallback simple
            alert(mensaje);
         }
      }
   }
})();
