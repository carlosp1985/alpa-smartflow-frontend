(function () {
   'use strict';

   angular
      .module('alpaPosApp')
      .controller('PerfilController', PerfilController);

   PerfilController.$inject = ['$scope', 'AuthService'];

   function PerfilController($scope, AuthService) {
      $scope.usuario = AuthService.getCurrentUser();
   }

})();

