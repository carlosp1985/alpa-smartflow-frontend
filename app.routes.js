(function () {
   'use strict';

   /**
    * Configuración de rutas principales de la aplicación.
    *
    * Se utiliza ngRoute para definir las rutas y asociar cada una con
    * sus vistas y controladores correspondientes.
    */
   angular
      .module('alpaPosApp')
      .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

         $locationProvider.hashPrefix('');

         $routeProvider
            // Login (solo para usuarios no autenticados)
            .when('/login', {
               templateUrl: 'views/login.html',
               controller: 'LoginController',
               controllerAs: 'vm',
               onlyGuest: true
            })

            // Dashboard (dentro del layout principal)
            .when('/dashboard', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/dashboard.html';
                  }
               }
            })

            // Usuarios
            .when('/usuarios', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/usuarios/lista.html';
                  }
               }
            })
            .when('/usuarios/nuevo', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/usuarios/formulario.html';
                  }
               }
            })
            .when('/usuarios/:id', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/usuarios/formulario.html';
                  }
               }
            })

            // Categorías
            .when('/categorias', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/categorias/lista.html';
                  }
               }
            })
            .when('/categorias/nueva', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/categorias/formulario.html';
                  }
               }
            })
            .when('/categorias/:id', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/categorias/formulario.html';
                  }
               }
            })

            // Productos
            .when('/productos', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/productos/lista.html';
                  }
               }
            })
            .when('/productos/nuevo', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/productos/formulario.html';
                  }
               }
            })
            .when('/productos/:id', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/productos/formulario.html';
                  }
               }
            })

            // Clientes
            .when('/clientes', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/clientes/lista.html';
                  }
               }
            })
            .when('/clientes/nuevo', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/clientes/formulario.html';
                  }
               }
            })
            .when('/clientes/:id', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/clientes/formulario.html';
                  }
               }
            })

            // Ventas
            .when('/ventas/caja', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/ventas/caja.html';
                  }
               }
            })
            .when('/ventas/historial', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/ventas/lista.html';
                  }
               }
            })
            .when('/ventas/:id', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/ventas/detalle.html';
                  }
               }
            })

            // Reportes
            .when('/reportes/ventas-fechas', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/reportes/ventasFechas.html';
                  }
               }
            })
            .when('/reportes/ventas-producto', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/reportes/ventasProducto.html';
                  }
               }
            })
            .when('/reportes/inventario-bajo', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/reportes/inventarioBajo.html';
                  }
               }
            })

            // Inventario
            .when('/inventario/movimientos', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/inventario/movimientos.html';
                  }
               }
            })
            .when('/inventario/ajustes', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/inventario/ajustes.html';
                  }
               }
            })

            // Configuración
            .when('/config', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/config/general.html';
                  }
               }
            })

            // Perfil de usuario
            .when('/perfil', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/perfil.html';
                  }
               }
            })

            // Facturación
            .when('/facturacion/:venta_id', {
               templateUrl: 'views/layout.html',
               controller: 'LayoutController',
               controllerAs: 'layoutVm',
               requiresAuth: true,
               resolve: {
                  contenido: function () {
                     return 'views/facturacion/detalle.html';
                  }
               }
            })

            // Redirección por defecto
            .otherwise({
               redirectTo: '/login'
            });

      }]);

})();

