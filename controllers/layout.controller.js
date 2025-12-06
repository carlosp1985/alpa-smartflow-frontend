/**
 * Controlador del layout principal (navbar + sidebar + área de contenido).
 *
 * Se encarga de:
 *  - Mostrar la información básica del usuario autenticado.
 *  - Controlar la apertura/cierre del menú lateral (sidenav).
 *  - Cerrar sesión y redirigir al login.
 */
(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('LayoutController', LayoutController);

   LayoutController.$inject = ['$location', 'AuthService', 'contenido'];

   function LayoutController($location, AuthService, contenido) {
      var vm = this;

      // Ruta de la vista interna que se mostrará en el área de contenido
      vm.vistaContenido = contenido;

      // Datos del usuario autenticado
      vm.usuarioActual = AuthService.getCurrentUser();

      // Funciones expuestas a la vista
      vm.irA = irA;
      vm.cerrarSesion = cerrarSesion;
      vm.esAdmin = esAdmin;

      // Inicialización de componentes de Materialize
      inicializarComponentesUI();

      /**
       * Navega a una ruta específica usando $location.
       * @param {string} ruta Ruta interna (por ejemplo '/dashboard').
       */
      function irA(ruta) {
         $location.path(ruta);
      }

      /**
       * Cierra la sesión del usuario actual y redirige al login.
       */
      function cerrarSesion() {
         AuthService.logout();
         $location.path('/login');
      }

      /**
       * Indica si el usuario actual tiene rol ADMINISTRADOR.
       * Se utiliza para mostrar/ocultar opciones del menú.
       */
      function esAdmin() {
         return vm.usuarioActual && vm.usuarioActual.rol === 'ADMINISTRADOR';
      }

      /**
       * Inicializa componentes de Materialize (sidenav, dropdown, etc.).
       */
      function inicializarComponentesUI() {
         // Se utiliza setTimeout para asegurar que el DOM está listo
         setTimeout(function () {
            var elemsSidenav = document.querySelectorAll('.sidenav');
            if (window.M && M.Sidenav) {
               M.Sidenav.init(elemsSidenav, {});
            }

            var elemsDropdown = document.querySelectorAll('.dropdown-trigger');
            if (window.M && M.Dropdown) {
               M.Dropdown.init(elemsDropdown, {
                  constrainWidth: false,
                  coverTrigger: false
               });
            }
         }, 0);
      }
   }

})();

