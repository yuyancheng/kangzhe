'use strict';

app.controller('EmployeeDetails', function($rootScope, $scope, $state) {
  $scope.details = $rootScope.details;
/*  $scope.goBack = function(){
    $state.transitionTo('app.org', true);
  };*/
});